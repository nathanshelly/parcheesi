#lang racket/base

  (require games/parcheesi/board
	   games/parcheesi/moves
           racket/match
           xml)
  
  (provide parse-board
           unparse-board
           parse-dice
           unparse-dice
           parse-moves
           unparse-moves
           parse-color
           parse-error
           remove-whitespace
           snd
           rcv)
  
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  ;;
  ;; tcp/ip utils
  ;;
  
  (define (snd xexpr out) 
    ;(printf "<< ~s\n" xexpr)
    (parameterize ([empty-tag-shorthand 'never])
      (write-xml/content (xexpr->xml xexpr) out)
      (newline out))
    (flush-output out))
  (define (rcv in) 
    (let ([ans (remove-whitespace (xml->xexpr (read-xml/element in)))])
      ;(printf ">> ~s\n" ans)
      ans))
  
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  ;;
  ;; parsing
  ;;
  
  ;; unparse-dice : (listof number) -> xexpr
  (define (unparse-dice lon)
    `(dice () ,@(map (lambda (die) `(die () ,(number->string die))) lon)))
  
  ;; parse-dice : xexpr -> (listof number)
  (define (parse-dice in-xexpr)
    (let ([xexpr (remove-whitespace in-xexpr)])
      (match xexpr
        [`(dice () (die () ,d) ...)
          (map parse-number d)]
        [else (parse-error "expected dice with die inside" xexpr)])))

  ;; unparse-moves : (listof move) -> xexpr
  (define (unparse-moves moves)
    `(moves ,@(map unparse-move moves)))
  
  ;; unparse-move : move -> xexpr
  (define (unparse-move move)
    (cond
      [(enter-piece? move) `(enter-piece ,(unparse-pawn (enter-piece-pawn move)))]
      [(move-piece-main? move)
       `(move-piece-main ,(unparse-pawn (move-piece-main-pawn move))
                         (start ,(number->string (move-piece-main-start move)))
                         (distance ,(number->string (move-piece-main-distance move))))]
      [(move-piece-home? move)
       `(move-piece-home ,(unparse-pawn (move-piece-home-pawn move))
                         (start ,(number->string (move-piece-home-start move)))
                         (distance ,(number->string (move-piece-home-distance move))))]))

  ;; parse-moves : xexpr -> (listof move)
  (define (parse-moves in-xexpr)
    (let ([xexpr (remove-whitespace in-xexpr)]) 
      (match xexpr
        [`(moves () ,the-moves ...) (map parse-move the-moves)]
        [else (parse-error "expected moves" xexpr)])))
  
  ;; parse-move : xexpr -> move
  (define (parse-move xexpr)
    (match xexpr
      [`(enter-piece () ,pawn) (make-enter-piece (parse-pawn pawn))]
      [`(move-piece-main () ,pawn (start () ,start) (distance () ,distance))
        (make-move-piece-main (parse-pawn pawn)
                              (parse-number start)
                              (parse-number distance))]
      [`(move-piece-home () ,pawn (start () ,start) (distance () ,distance))
        (make-move-piece-home (parse-pawn pawn)
                              (parse-number start)
                              (parse-number distance))]
      [else (parse-error "expected move" xexpr)]))
  
  ;; unparse-board : board -> xexpr
  (define (unparse-board board)
    `(board ()
            (start () ,@(map unparse-pawn (board-start board)))
            (main () ,@(unparse-array board-main-size (lambda (i) (board-main-i board i))))
            (home-rows () 
                       ,@(unparse-array board-home-row-size (lambda (i) (board-home-row-i board 'green i)))
                       ,@(unparse-array board-home-row-size (lambda (i) (board-home-row-i board 'red i)))
                       ,@(unparse-array board-home-row-size (lambda (i) (board-home-row-i board 'blue i)))
                       ,@(unparse-array board-home-row-size (lambda (i) (board-home-row-i board 'yellow i))))
            (home () ,@(map unparse-pawn (board-home board)))))
    
  ;; unparse-pawn : pawn -> xexpr
  (define (unparse-pawn pawn) 
    `(pawn ()
           (color () ,(symbol->string (pawn-color pawn)))
           (id () ,(format "~a" (pawn-id pawn)))))
  
  ;; unparse-array : number (number -> (listof pawn)) -> (listof xexpr)
  (define (unparse-array size board-x-i)
    (let loop ([i size])
      (cond
        [(zero? i) null]
        [else (let* ([index (- i 1)]
                     [ent (board-x-i index)])
                (if (null? ent)
                    (loop (- i 1))
                    (append (map (lambda (x) `(piece-loc ()
                                               ,(unparse-pawn x) 
                                               (loc ,(number->string index)))) 
                                 ent)
                            (loop (- i 1)))))])))
  
  (define (parse-board in-xexpr)
    (let ([xexpr (remove-whitespace in-xexpr)])
      (let ([board (new-board)])
        (match xexpr
          [`(board () 
                   (start () ,starts ...)
                   (main () ,mains ...)
                   (home-rows () ,home-row-piece-locs ...)
                   (home () ,homes ...))
            ;; all pawns in start to being with, so can ignore starts.
            (call-with-pls (lambda (i pawn) 
                             (set! board (move-piece board pawn i)))
                           mains)
            (call-with-pls (lambda (i pawn)
                             (set! board 
                                   (move-piece board pawn (make-home-row-loc i (pawn-color pawn)))))
                           home-row-piece-locs)
            (for-each (lambda (home) 
                        (set! board (move-piece board (parse-pawn home) 'home)))
                      homes)]
          [_ (parse-error "not a board" xexpr)])
        board)))
  
  (define (parse-piece-loc piece-loc)
    (match piece-loc
      [`(piece-loc () ,color-xexpr (loc () ,number-str))
        (let ([pawn (parse-pawn color-xexpr)]
              [number (parse-number number-str)])
          (values pawn number))]
      [_ (parse-error "expected a piece-loc" piece-loc)]))
  
  (define (call-with-pls f piece-locs)
    (for-each (lambda (piece-loc)
                (let-values ([(pawn number) (parse-piece-loc piece-loc)])
                  (f number pawn)))
              piece-locs))
               
  ;; parse-number : xexpr -> number
  (define (parse-number str)
    (cond
      [(and (string? str) (string->number str))
       =>
       (lambda (x) x)]
      [else (parse-error "expected number" str)]))
  
  (define (parse-pawn color-xexpr)
    (match color-xexpr
      [`(pawn () (color () ,color-str) (id () ,id))
        (let ([color (parse-color color-str)]
              [num (parse-number id)])
          (unless (memq num '(0 1 2 3))
            (parse-error "expected 0 1 2 or 3" id))
          (make-pawn color num))]
      [else (parse-error "expected pawn" color-xexpr)]))
  
  (define (parse-color color-str)
    (let ([color (if (string? color-str)
                     (string->symbol color-str)
                     (parse-error "expected a color name" color-str))])
      (unless (memq color '(red blue green yellow))
        (parse-error "expected color (red blue green or yellow)" color-str))
      color))
  
  (define (parse-error msg xexpr)
    (let ([sp (open-output-string)])
      (with-handlers ([void (lambda (x) (write xexpr sp))])
        (write-xml/content (xexpr->xml xexpr) sp))
      (error 'parse-error "~a" (string-append msg ":\n" (get-output-string sp)))))
   
  (define example-board
    (make-board (list (make-pawn 'blue 0)
                      (make-pawn 'green 1)
                      (make-pawn 'red 2)
                      (make-pawn 'yellow 3))
                `#68(() () () () () (,(make-pawn 'green 0)) () () 
                        () () () () () () () () 
                        ()
                        () () () () () (,(make-pawn 'red 1)) () ()
                        () () () () () () () () 
                        ()
                        () () () () () (,(make-pawn 'blue 3)) () () 
                        () () () () () () () () 
                        ()
                        () () () () () (,(make-pawn 'yellow 2)) () () 
                        () () () () () () () ())
                (list (cons 'green `#7((,(make-pawn 'green 2)) ()))
                      (cons 'red `#7(() (,(make-pawn 'red 3)) ()))
                      (cons 'blue `#7(() () (,(make-pawn 'blue 1)) ()))
                      (cons 'yellow `#7(() () () (,(make-pawn 'yellow 0)) ())))
                (list (make-pawn 'blue 2)
                      (make-pawn 'green 3)
                      (make-pawn 'red 0)
                      (make-pawn 'yellow 1))))
  
  ;; remove-whitespace : xexpr -> xexpr
  (define (remove-whitespace xexpr)
    (define (remove-from-list lst)
      (let loop ([lst lst])
        (cond
          [(null? lst) null]
          [(and (string? (car lst))
                (regexp-match #rx"^[ \t\n]*$" (car lst)))
           (loop (cdr lst))]
          [(string? (car lst))
           (cons
            (apply
             string
             (let loop ([cs (string->list (car lst))])
               (cond
                 [(null? cs) null]
                 [else (if (char-whitespace? (car cs))
                           (loop (cdr cs))
                           (cons (car cs) (loop (cdr cs))))])))
            (loop (cdr lst)))]
          [else (cons (remove-from-ele (car lst)) (loop (cdr lst)))])))
    (define (remove-from-ele ele)
      (match ele
        [`(,tag ,attrs ,body ...) `(,tag ,attrs ,@(remove-from-list body))]
        [else ele]))
    (remove-from-ele xexpr))
  
(module+ test
  (require rackunit)
    (define (test-board board) 
      (test-same parse-board unparse-board board))
    (define (test-dice dice)
      (test-same parse-dice unparse-dice dice))
    (define (test-moves moves)
      (test-same parse-moves unparse-moves moves))
    
    (define (test-same parse unparse item)
      (let-values ([(in out) (make-pipe)])
        (thread
         (lambda ()
           (display-xml/content (xexpr->xml (unparse item)) out)
           (close-output-port out)))
        (equal? item (parse (xml->xexpr (document-element (read-xml in)))))))
    
    (check-true (test-board (new-board)))
    (check-true (test-board example-board))
    (check-true (test-dice '(2 3)))
    (check-true (test-dice '(1 1 6 6)))
    (check-true (test-moves (list (make-enter-piece (make-pawn 'green 0))
                                  (make-move-piece-main (make-pawn 'red 1) 5 2)
                                  (make-move-piece-home (make-pawn 'yellow 3) 5 2)))))
