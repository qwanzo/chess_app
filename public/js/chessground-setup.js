/**
 * @fileoverview This file initializes the Chessground chess board with a default configuration.
 * It encapsulates the setup logic, making the main HTML file cleaner and the configuration
 * more maintainable.
 */
import { Chessground } from "/js/chessground.min.js"; // Assuming chessground.min.js is the provided library.

/**
 * Initializes the Chessground board on a specified HTML element.
 *
 * @param {HTMLElement} element - The DOM element where the chessboard will be rendered.
 * @returns {any} The initialized Chessground API object.
 */
export function initializeChessground(element) {
   if (!element) {
      console.error(
         "Chessboard element not found. Cannot initialize Chessground.",
      );
      return;
   }

   const chessgroundConfig = {
      /**
       * Initial position of the chess pieces in Forsyth-Edwards Notation (FEN).
       * Defaults to the standard starting position.
       */
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",

      /**
       * Configuration for piece movement.
       */
      movable: {
         /**
          * If true, pieces can be moved freely by any player.
          * Set to `true` for a sandbox-like experience, `false` to enforce game rules.
          */
         free: true,
         /**
          * Specifies which player's pieces are movable.
          * "white", "black", or "both".
          */
         color: "both",
         // Other movable options can be added here as needed, e.g., showDests, events, rookCastle.
         showDests: true,
      },

      /**
       * Configuration for piece dragging behavior.
       */
      draggable: {
         /**
          * If true, pieces can be dragged on the board.
          */
         enabled: true,
         /**
          * If true, a ghost image of the piece follows the cursor while dragging.
          */
         showGhost: true,
         // Other draggable options can be added here as needed, e.g., distance, autoDistance, deleteOnDropOff.
      },

      /**
       * Configuration for square selection.
       */
      selectable: {
         /**
          * If true, squares can be selected (clicked).
          */
         enabled: true,
      },

      /**
       * Configuration for highlighting squares.
       */
      highlight: {
         /**
          * If true, the squares of the last move are highlighted.
          */
         lastMove: true,
         /**
          * If true, the king's square is highlighted when in check.
          */
         check: true,
      },

      // Additional Chessground configuration options can be added here.
      // Examples: orientation, turnColor, coordinates, animation, premovable, predroppable, drawable, events.
   };

   const chessgroundInstance = Chessground(element, chessgroundConfig);

   console.log("Chessground board initialized successfully.");
   return chessgroundInstance;
}
