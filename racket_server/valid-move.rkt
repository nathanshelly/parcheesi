#lang racket

(require "parse.rkt" xml
         games/parcheesi/moves)

(define input-file (command-line #:args (input-filename) input-filename))

(define (fetch-and-process-input port)
  (define color (parse-color (read-line port)))
  (define board (parse-board (rcv port)))
  (define dice (parse-dice (rcv port)))
  (define moves (parse-moves (rcv port)))
  (with-handlers ([exn:bad-move?
                   (λ (x) (printf "illegal move: ~a\n"
                                  (exn-message x)))])
    (snd (unparse-board (take-turn color board dice moves))
         (current-output-port))))

(cond
  [input-file
   (call-with-input-file input-file
     (λ (port)
       (fetch-and-process-input port)))]
  [else
   (fetch-and-process-input (current-input-port))])
