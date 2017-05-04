#lang racket

(require "parse.rkt" xml
         games/parcheesi/moves
         games/parcheesi/gui
         racket/gui/base)

(define png #f)
(define input-file
  (command-line
   #:once-each
   [("--png" "-p") png-filename "save the board in a file" (set! png png-filename)]
   #:args (board-xml-filename) board-xml-filename))

(define (fetch-and-process-input port)
  (parse-board (rcv port)))

(define board
  (cond
    [input-file
     (call-with-input-file input-file
       (λ (port)
         (fetch-and-process-input port)))]
    [else
     (fetch-and-process-input (current-input-port))]))

(cond
  [png
   (define w 400)
   (define h 400)
   (define bmp (make-bitmap w h))
   (define bdc (make-object bitmap-dc% bmp))
   (draw-board board bdc w h 0 0 #t)
   (send bdc set-bitmap #f)
   (send bmp save-file png 'png)]
  [else (show-board board)])
