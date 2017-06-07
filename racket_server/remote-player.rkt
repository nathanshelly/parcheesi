#lang racket/base

  (require games/parcheesi/interfaces
           "parse.rkt"
           racket/tcp
	   racket/class
	   racket/match
	   racket/gui/base)
  
  (provide remote-player%)

  (define timeout 10)
  
  (define remote-player%
    (class* object% (player<%>)
      (init-field in out override-name)
      
      (define/public (start-game color)
        (with-handlers ([exn? (lambda (x) override-name)])
          ;; need to guarantee that we actually return a name here,
          ;; or else the tournament will not function properly.
          (snd `(start-game ,(symbol->string color)) out)
          (get-name-response)
          override-name))
      
      (define/public (doubles-penalty)
        (snd `(doubles-penalty) out)
        (get-void-response))
      
      (define/public (do-move orig-board dice)
        (snd `(do-move ,(unparse-board orig-board) ,(unparse-dice dice)) out)
        (parse-moves (rcv/timeout)))
      
      (define/private (get-void-response)
        (match (rcv/timeout)
          [`(void ()) (void)]
          [x (error 'get-void-response "expected void, got ~s" x)]))
      
      (define/private (get-name-response)
        (match (rcv/timeout)
          [`(name () ,(? string? x)) x]
          [x (error 'get-name-response "expected a name, got ~s" x)]))
      
      (define/private (rcv/timeout)
        (let ([c (make-channel)])
          (thread
           (lambda ()
             (sleep timeout) 
             (channel-put c 'timeout)))
          (thread
           (lambda ()
             (channel-put c (rcv in))))
          (channel-get c)))
      
      (super-new)))
  
  (define (get-listener)
    (let loop ([msg #f])
      (let ([port (get-port-user msg)])
        (with-handlers ([exn? (lambda (x) (loop (exn-message x)))])
          (tcp-listen port)))))
  
  (define (get-port-user msg)
    (define d (new dialog% (label "Choose Hostname and Port")))
    (define p-txt (new text-field% 
                       (parent d)
                       (label "Port")
                       (init-value "8000")
                       (callback void)))
    (define btn (new button% 
                     (label "Ok") 
                     (parent d)
                     (style '(border))
                     (callback
                      (lambda (x y)
                        (when (string->number (send p-txt get-value))
                          (send d show #f))))))
    (when msg
      (new message% (label msg) (parent d)))
    (send d show #t)
    (string->number (send p-txt get-value)))
  
  (define (get-port/host-user)
    (define d (new dialog% (label "Choose Hostname and Port")))
    (define h-txt (new text-field% 
                       (parent d)
                       (label "Hostname")
                       (init-value "localhost")
                       (callback void)))
    (define p-txt (new text-field% 
                       (parent d)
                       (label "Port")
                       (init-value "8000")
                       (callback void)))
    (define btn (new button% 
                     (label "Ok") 
                     (parent d)
                     (style '(border))
                     (callback
                      (lambda (x y)
                        (when (string->number (send p-txt get-value))
                          (send d show #f))))))
    (send d show #t)
    (values (string->number (send p-txt get-value))
            (send h-txt get-value)))
