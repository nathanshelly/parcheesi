#lang racket/base
(require games/parcheesi/play-game
         games/parcheesi/best-players
         "remote-player.rkt"
         "parse.rkt"
         racket/tcp
         racket/match
         racket/class
         racket/list
         racket/gui/base)

(define max-players 20)
  
(define port (if (equal? (current-command-line-arguments) #())
                 8000
                 (string->number (vector-ref (current-command-line-arguments) 0))))
(unless port
  (error 'tournament "expected a port number on the command line, found ~a" 
         (vector-ref (current-command-line-arguments) 0)))

(define orig-eventspace (current-eventspace))
  
;; name : string
;; games : number  -- number of games played
;; obj : (is-a?c player<%>)
(define-struct player (name [games #:mutable] obj) #:transparent)
  
(define player-frame (new frame% 
                          (label "Parcheesi Tournament")
                          (width 200)
                          (height 500)))
  
(define list-box (new list-box%
                      (label #f)
                      (choices '())
                      (parent player-frame)
                      (callback void)))
  
(define start-button (new button%
                          (label "Start Tournament")
                          (parent player-frame)
                          (callback
                           (lambda (x y)
                             (channel-put start-tournament-chan (void))))))
  
(define (add-player player)
  (send list-box append (player-name player) player))
  
;; connections-chan : (channel (cons input-port output-port))
(define connections-chan (make-channel))
  
;; start-tournament-chan (channel (void))
(define start-tournament-chan (make-channel))
  
(void
 (let ([listener (tcp-listen port 12 #t)])
   (thread
    (lambda ()
      (let loop ()
        (let-values ([(in out) (tcp-accept listener)])
          (channel-put connections-chan (cons in out))
          (loop)))))))
  
;; show frame after starting listener
(send player-frame show #t)

(void
 (thread
  (lambda ()
    (let loop ([connections '()])
      (sync
       (handle-evt
        connections-chan
        (lambda (pr)
          (cond
            [(< (length connections) max-players)
             (let* ([in (car pr)]
                    [out (cdr pr)]
                    [name (get-name in out)])
               (cond
                 [name
                  (let ([player (make-player name
                                             0 
                                             (new remote-player% 
                                                  [in in]
                                                  [out out]
                                                  [override-name name]))])
                    (queue-callback
                     (lambda ()
                       (add-player player)))
                    (loop (cons player connections)))]
                 [else (loop connections)]))]
            [else
             (printf "too many players, dropping player\n")
             (loop connections)])))
       (handle-evt
        start-tournament-chan
        (lambda (_)
          (printf "starting tournament\n")
          (start-tournament connections))))))))
    
(define names-table (make-hash))
(define (get-name in out)
  (with-handlers ([exn:fail?
                   (lambda (x) 
                     (printf "error getting name ~s\n" x)
                     #f)])
    (snd `(start-game "red") out)
    (let ([network-name
           (match (rcv in)
             [`(name () ,(? string? name)) name]
             [x (error 'get-name "bad name ~s" x)])])
      (let loop ([n #f])
        (let ([name-candidate (if n
                                  (format "~a #~a" network-name n)
                                  network-name)])
          (let ([bound? (hash-ref names-table name-candidate (lambda () #f))])
            (cond
              [bound? (loop (if n (+ n 1) 1))]
              [else
               (hash-set! names-table name-candidate #t)
               name-candidate])))))))
  
(define (start-tournament players)
  (let loop ([winners '()]
             [good-players players])
    (print-struct #t)
    (cond
      [(= (length winners) 4)
       (printf "winner ~s\n" (channel-get (play-game/thread winners)))]
      [(<= (length good-players) (- 4 (length winners)))
       (loop (append winners 
                     good-players
                     (make-standin-players (- 4 
                                              (length winners) 
                                              (length good-players))))
             '())]
      [else
       (let* ([chans (start-many-games good-players (- 4 (length winners)))]
              [local-winners/cheaters (map (lambda (c) (channel-get c)) chans)]
              [local-winners (map (lambda (x) (name->player x players))
                                  (filter (lambda (x) x) 
                                          (map car local-winners/cheaters)))]
              [cheaters (map (lambda (x) (name->player x players))
                             (apply append (map cadr local-winners/cheaters)))])
         (loop (append local-winners winners)
               (remove-many local-winners (remove-many cheaters good-players))))])))
  
(define (make-standin-players n)
  (let loop ([n n])
    (cond
      [(zero? n) '()]
      [else 
       (let ([name (format "Standin Random Player ~a" n)])
         (cons (make-player name 0 (new random-player% [name name]))
               (loop (- n 1))))])))
  
;; start-many-games : (listof players) -> (listof chan)
;; starts as many games as possible in players
;; effect: updates the player-games count
;; returns the channels that tell the results of the games
(define (start-many-games players max-games)
  (let loop ([players players]
             [max-games max-games])
    (cond
      [(zero? max-games) '()]
      [else
       (let ([to-play (pick-four-players players)])
         (if to-play
             (begin
               (for-each (lambda (player) (set-player-games! player (+ (player-games player) 1)))
                         to-play)
               (cons (play-game/thread to-play)
                     (loop (remove-many to-play players) (- max-games 1))))
             '()))])))
  
(define (name->player name players)
  (cond
    [(not name) #f]
    [else (let loop ([players players])
            (cond
              [(null? players) #f]
              [else (if (equal? name (player-name (car players)))
                        (car players)
                        (loop (cdr players)))]))]))
              
;; pick-four-players : (listof players) -> (union #f (list player player player player))
(define (pick-four-players players)
  (cond
    [(< (length players) 4) #f]
    [else
     (let loop ([picked-players '()]
                [unpicked-players players])
       (let* ([min-count (apply min (map player-games unpicked-players))]
              [min-players (filter (lambda (x) (= (player-games x) min-count))
                                   players)])
         (cond
           [(< (+ (length min-players) (length picked-players)) 4)
            (loop (append min-players picked-players)
                  (remove-many min-players unpicked-players))]
           [else (append picked-players 
                         (randomly-select (- 4 (length picked-players)) min-players))])))]))
  
;; remove-many : list-of-X list-of-X -> list-of-X
;; removes each element of the first list from the second list and returns that
(define (remove-many to-remove main-list) (foldl remove main-list to-remove))
  
(define (randomly-select n lst)
  (cond
    [(zero? n) null]
    [else 
     (let ([selected (list-ref lst (random (length lst)))])
       (cons selected (randomly-select (- n 1) (remove selected lst))))]))
  
(define (play-game/thread players)
  (define c (make-channel))
  (thread
   (lambda ()
     (channel-put 
      c
      (play-game (map player-obj players)))))
  c)
  
(module+ test
  (require rackunit)

  (define (all-ns players ns)
    (for/and ([x (in-list players)])
      (member (player-games x) ns)))

  (check-not-false (all-ns (pick-four-players (list (make-player "a" 0 #f)
                                               (make-player "b" 0 #f)
                                               (make-player "c" 0 #f)
                                               (make-player "d" 0 #f)
                                               (make-player "e" 0 #f)
                                               (make-player "f" 0 #f)
                                               (make-player "g" 0 #f)
                                               (make-player "h" 0 #f)
                                               (make-player "i" 0 #f)
                                               (make-player "j" 0 #f)))
                      (list 0)))

  (check-not-false (all-ns (pick-four-players (list (make-player "a" 0 #f)
                                               (make-player "b" 1 #f)
                                               (make-player "c" 0 #f)
                                               (make-player "d" 1 #f)
                                               (make-player "e" 0 #f)
                                               (make-player "f" 1 #f)
                                               (make-player "g" 1 #f)
                                               (make-player "h" 0 #f)
                                               (make-player "i" 0 #f)
                                               (make-player "j" 0 #f)))
                      (list 0)))

  (check-not-false (all-ns (pick-four-players (list (make-player "a" 1 #f)
                                               (make-player "b" 1 #f)
                                               (make-player "c" 1 #f)
                                               (make-player "d" 0 #f)
                                               (make-player "e" 1 #f)
                                               (make-player "f" 0 #f)
                                               (make-player "g" 1 #f)
                                               (make-player "h" 1 #f)
                                               (make-player "i" 0 #f)
                                               (make-player "j" 0 #f)))
                      (list 0)))

  (check-not-false
   (all-ns (pick-four-players (list (make-player "a" 1 #f)
                                    (make-player "b" 1 #f)
                                    (make-player "c" 1 #f)
                                    (make-player "d" 1 #f)
                                    (make-player "e" 1 #f)
                                    (make-player "f" 1 #f)
                                    (make-player "g" 1 #f)
                                    (make-player "h" 1 #f)
                                    (make-player "i" 0 #f)
                                    (make-player "j" 0 #f)))
           (list 0 1)))

  (check-false (pick-four-players (list (make-player "a" 0 #f)
                                        (make-player "b" 0 #f)
                                        (make-player "c" 0 #f)))))
