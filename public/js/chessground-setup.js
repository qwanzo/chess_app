/* All features can be easily enabled/disabled by modifying the configuration object
 * in the initializeChessboard() function. See detailed instructions below for each feature.
 */
import { Chess } from "./chess.js"; // Import Chess as a named export from the local file path

/**
  * Creates a Chess instance for move validation and game state management.
@@ -31,7 +32,11 @@
 function createChessEngine() {
    // Dynamically import chess.js
    // Note: In production, you may want to load this as a module
-   // Ensure Chess is available globally or imported correctly
-   if (typeof Chess === "undefined") {
-      throw new Error("chess.js library not found or not loaded globally.");
-   }
-   return new Chess();
+   // We've now imported it directly, so we expect it to be available.
+   // The previous error was due to incorrect module resolution.
+   // If this still fails, it might indicate an issue with the import path or
+   // the structure of the chess.js module itself.
+   // For now, we assume the import works and create a new instance.
+   return new Chess();
 }

 /**
=======
function createChessEngine() {
   // Dynamically import chess.js
   // Note: In production, you may want to load this as a module
-  // Ensure Chess is available globally or imported correctly
-  if (typeof Chess === "undefined") {
-    throw new Error("chess.js library not found or not loaded globally.");
-  }
-  return new Chess();
+  // We've now imported it directly, so we expect it to be available.
+  // The previous error was due to incorrect module resolution.
+  // For now, we assume the import works and create a new instance.
+  return new Chess();
 }

 /**
 * =====================
 * All features can be easily enabled/disabled by modifying the configuration object
 * in the initializeChessboard() function. See detailed instructions below for each feature.
 */

import { Chessground } from "/js/chessground.min.js"; // Attempt to import chess.js as an ES module

/**
 * Creates a Chess instance for move validation and game state management.
 * This uses the chess.js library to enforce standard chess rules.
 *
 * @returns {Object} A Chess instance from chess.js
 */
function createChessEngine() {
   // Dynamically import chess.js
   // Note: In production, you may want to load this as a module
   // Ensure Chess is available globally or imported correctly
   if (typeof Chess === "undefined") {
      throw new Error("chess.js library not found or not loaded globally.");
   }
   return new Chess();
}

/**
 * Converts square positions from chess.js format (e.g., 'e2') to Chessground format
 * and calculates all legal destinations for a given square.
 *
 * @param {Object} chess - The Chess engine instance
 * @param {string} square - The square in algebraic notation (e.g., 'e2')
 * @returns {Array<string>} Array of valid destination squares
 *
 * EXAMPLE:
 * If you move the white pawn from e2, this returns ['e3', 'e4']
 */
function getLegalMovesForSquare(chess, square) {
   const moves = chess.moves({ square: square, verbose: true });
   return moves.map((move) => move.to);
}

/**
 * Converts Chessground piece representation to chess.js format.
 *
 * @param {Object} cgPiece - Chessground piece object with 'color' and 'role' properties
 * @returns {string} Single character representing the piece (e.g., 'p' for pawn, 'N' for Knight)
 *
 * PIECE MAPPING:
 * - Pawns: 'p'
 * - Knights: 'n'
 * - Bishops: 'b'
 * - Rooks: 'r'
 * - Queens: 'q'
 * - Kings: 'k'
 */
function convertCGPieceToChessJS(cgPiece) {
   const pieceMap = {
      pawn: "p",
      knight: "n",
      bishop: "b",
      rook: "r",
      queen: "q",
      king: "k",
   };

   const piece = pieceMap[cgPiece.role] || "";
   return cgPiece.color === "white" ? piece.toUpperCase() : piece;
}

/**
 * Initializes the Chessground chess board with full feature support.
 * This is the main entry point for setting up the chess board.
 *
 * @param {HTMLElement} boardElement - The DOM element where the chessboard will render
 * @param {Object} options - Optional configuration overrides
 * @returns {Object} Object containing the Chessground instance and Chess engine
 *
 * USAGE IN HTML:
 * ==============
 * import { initializeChessboard } from "/js/chessground-setup.js";
 *
 * const chessboardElement = document.getElementById("chessboard");
 * const { ground, chess } = initializeChessboard(chessboardElement);
 *
 * // Later, you can access moves with:
 * console.log(chess.moves()); // Get all legal moves
 * console.log(chess.in_check()); // Check if in check
 */
export function initializeChessboard(boardElement, options = {}) {
   // Validate that the element exists
   if (!boardElement) {
      console.error(
         "❌ Chessboard element not found. Cannot initialize Chessground.",
      );
      return null;
   }

   // Initialize the chess engine for move validation
   let chess = createChessEngine();

   // ============================================================================
   // FEATURE CONFIGURATION
   // ============================================================================
   // Modify these settings to enable/disable features or change behavior
   const featureConfig = {
      // FEATURE 1: LEGAL MOVE VALIDATION
      // Set to true to only allow legal chess moves
      // Set to false to allow any piece to move anywhere (sandbox mode)
      enableLegalMoveValidation: true,

      // FEATURE 2: SELF-CAPTURE PREVENTION
      // Automatically prevents capturing your own pieces
      // (Works when enableLegalMoveValidation is true)
      preventSelfCapture: true,

      // FEATURE 3: POSSIBLE MOVE HIGHLIGHTS
      // Set to true to show dots/highlights on valid destination squares
      // when you select a piece
      // Set to false to hide these visual indicators
      showPossibleMoves: true,

      // FEATURE 4: TURN-BASED PLAY
      // Set to true to enforce turn order (white moves first, alternates)
      // Set to false to allow either side to move at any time
      enforceTurnOrder: true,

      // FEATURE 5: HIGHLIGHT CHECK
      // Set to true to highlight the king when in check
      // Set to false to disable check highlighting
      highlightCheck: true,

      // FEATURE 6: LAST MOVE HIGHLIGHT
      // Set to true to highlight the squares of the last move
      // Set to false to disable this highlighting
      highlightLastMove: true,
   };

   // ============================================================================
   // CHESSGROUND CONFIGURATION
   // ============================================================================
   const chessgroundConfig = {
      /**
       * Initial board position in FEN (Forsyth-Edwards Notation).
       * This is the standard chess starting position.
       * You can change this to any valid FEN string to start from a different position.
       *
       * EXAMPLE FEN STRINGS:
       * - Starting position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
       * - After 1.e4: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
       */
      fen: chess.fen(),

      /**
       * FEATURE 4: Turn-based enforcement
       * Sets which player can move pieces
       * When enforceTurnOrder is true, this is automatically managed
       */
      movable: {
         /**
          * free mode: true = pieces can move anywhere (sandbox)
          *            false = pieces can only move to legal squares (requires move validation)
          *
          * TO ENABLE/DISABLE:
          * Set to false when enableLegalMoveValidation is true
          * Set to true for sandbox mode
          */
         free: !featureConfig.enableLegalMoveValidation,

         /**
          * FEATURE 4: Enforce turn order
          * "white" = only white pieces can move
          * "black" = only black pieces can move
          * "both" = either player can move (set enforceTurnOrder to false)
          *
          * TO ENABLE/DISABLE TURN ORDER:
          * Set to featureConfig.enforceTurnOrder ? chess.turn() === "w" ? "white" : "black" : "both"
          */
         color: featureConfig.enforceTurnOrder
            ? chess.turn() === "w"
               ? "white"
               : "black"
            : "both",

         /**
          * FEATURE 3: Show possible moves
          * Set to true to display dots on valid destination squares
          * Set to false to hide move indicators
          *
          * TO ENABLE/DISABLE:
          * Change the condition below to featureConfig.showPossibleMoves
          */
         showDests: featureConfig.showPossibleMoves,

         /**
          * Dests function: Called by Chessground to determine valid moves for a piece
          * This integrates chess.js to enforce legal moves only
          *
          * TO ENABLE/DISABLE LEGAL MOVE VALIDATION:
          * When enableLegalMoveValidation is true, this function returns legal moves
          * When false, all squares are returned (sandbox mode)
          */
         dests: featureConfig.enableLegalMoveValidation
            ? (square) => getLegalMovesForSquare(chess, square)
            : undefined,

         /**
          * Events: Handlers for move events
          * onMove: Called when a piece is moved on the board
          * onNewPiece: Called when a piece is dropped on the board
          */
         events: {
            /**
             * onMove handler: Updates the game state after a move
             *
             * This is called when:
             * 1. A piece is dragged and dropped to a new square
             * 2. A piece is selected and a destination is chosen
             *
             * The function updates the Chess engine with the new move,
             * refreshes the board display, and updates move highlighting.
             */
            after(fromSquare, toSquare, metadata) {
               // Attempt to make the move in chess.js
               const moveResult = chess.move({
                  from: fromSquare,
                  to: toSquare,
                  promotion: "q", // Default to queen promotion for pawn moves
               });

               // If the move is illegal, revert the move in Chessground
               if (!moveResult) {
                  console.warn(
                     `⚠️  Illegal move attempted: ${fromSquare} to ${toSquare}`,
                  );
                  // Revert the move in Chessground
                  setTimeout(() => {
                     ground.set({ fen: chess.fen() });
                  }, 0);
                  return;
               }

               // Move was legal, update the board state
               console.log(
                  `✅ Move made: ${moveResult.san} (${fromSquare} → ${toSquare})`,
               );

               // Update Chessground with the new position
               ground.set({
                  fen: chess.fen(),
                  turnColor: chess.turn() === "w" ? "white" : "black",
                  movable: {
                     color: featureConfig.enforceTurnOrder
                        ? chess.turn() === "w"
                           ? "white"
                           : "black"
                        : "both",
                     dests: featureConfig.enableLegalMoveValidation
                        ? (square) => getLegalMovesForSquare(chess, square)
                        : undefined,
                     showDests: featureConfig.showPossibleMoves,
                  },
               });

               // Check for special conditions
               if (chess.in_check()) {
                  console.log("⚠️  Player is in CHECK!");
               }
               if (chess.in_checkmate()) {
                  console.log("🏁 CHECKMATE! Game Over!");
               }
               if (chess.in_stalemate()) {
                  console.log("🤝 STALEMATE! Game is a draw!");
               }
            },
         },
      },

      /**
       * FEATURE 3: Dragging configuration
       * Controls how pieces can be dragged on the board
       */
      draggable: {
         /**
          * enabled: Set to true to allow dragging pieces
          *          Set to false to disable dragging (click-to-move only)
          *
          * TO ENABLE/DISABLE DRAGGING:
          * Change 'true' to 'false' to disable piece dragging
          */
         enabled: true,

         /**
          * showGhost: Set to true to show a ghost image while dragging
          *            Set to false to hide the ghost image
          *
          * TO ENABLE/DISABLE GHOST IMAGE:
          * Change 'true' to 'false' to remove the drag shadow
          */
         showGhost: true,

         /**
          * distance: Minimum distance in pixels to trigger a drag
          * autoDistance: Automatically calculate optimal drag distance
          */
         distance: 3,
         autoDistance: true,

         /**
          * deleteOnDropOff: Set to true to remove a piece if dropped outside the board
          *                 Set to false to return the piece to its original square
          *
          * TO ENABLE/DISABLE:
          * Change 'false' to 'true' to enable piece deletion on drop-off
          */
         deleteOnDropOff: false,
      },

      /**
       * FEATURE: Square selection
       * Allows clicking on squares to select/move pieces
       */
      selectable: {
         /**
          * enabled: Set to true to allow clicking squares
          *          Set to false to disable click-to-select
          *
          * TO ENABLE/DISABLE:
          * Change 'true' to 'false' to disable click selection
          */
         enabled: true,
      },

      /**
       * FEATURE 5 & 6: Highlighting configuration
       */
      highlight: {
         /**
          * FEATURE 6: Last move highlighting
          * Set to true to highlight the squares of the last move
          * Set to false to disable
          *
          * TO ENABLE/DISABLE:
          * Change the condition to featureConfig.highlightLastMove
          */
         lastMove: featureConfig.highlightLastMove,

         /**
          * FEATURE 5: Check highlighting
          * Set to true to highlight the king's square when in check
          * Set to false to disable
          *
          * TO ENABLE/DISABLE:
          * Change the condition to featureConfig.highlightCheck
          */
         check: featureConfig.highlightCheck,
      },

      /**
       * Board orientation (perspective)
       * "white" = white on bottom, black on top
       * "black" = black on bottom, white on top
       */
      orientation: "white",

      /**
       * Animation configuration
       */
      animation: {
         enabled: true,
         duration: 200, // milliseconds
      },

      /**
       * Premove configuration (moves made while opponent is thinking)
       */
      premovable: {
         enabled: true,
         showDests: true,
      },
   };

   // ============================================================================
   // INITIALIZE CHESSGROUND INSTANCE
   // ============================================================================
   const ground = Chessground(boardElement, chessgroundConfig);

   // ============================================================================
   // LOG INITIALIZATION SUCCESS
   // ============================================================================
   console.log("✅ Chessground board initialized successfully!");
   console.log("📊 Feature Status:");
   console.log(
      `   Legal Move Validation: ${featureConfig.enableLegalMoveValidation ? "✓ ON" : "✗ OFF"}`,
   );
   console.log(
      `   Self-Capture Prevention: ${featureConfig.preventSelfCapture ? "✓ ON" : "✗ OFF"}`,
   );
   console.log(
      `   Possible Move Highlights: ${featureConfig.showPossibleMoves ? "✓ ON" : "✗ OFF"}`,
   );
   console.log(
      `   Turn-Based Play: ${featureConfig.enforceTurnOrder ? "✓ ON" : "✗ OFF"}`,
   );
   console.log(
      `   Check Highlight: ${featureConfig.highlightCheck ? "✓ ON" : "✗ OFF"}`,
   );
   console.log(
      `   Last Move Highlight: ${featureConfig.highlightLastMove ? "✓ ON" : "✗ OFF"}`,
   );

   // ============================================================================
   // RETURN CHESSGROUND AND CHESS INSTANCES
   // ============================================================================
   // Return both instances for external use and debugging
   return {
      ground,
      chess,
      featureConfig,
      /**
       * Helper function to reset the board to starting position
       * USAGE: resetBoard()
       */
      resetBoard() {
         chess.reset();
         ground.set({
            fen: chess.fen(),
            turnColor: "white",
            movable: {
               color: featureConfig.enforceTurnOrder ? "white" : "both",
            },
         });
         console.log("♻️  Board reset to starting position");
      },
      /**
       * Helper function to load a specific FEN position
       * USAGE: loadFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")
       */
      loadFEN(fenString) {
         if (chess.load(fenString)) {
            ground.set({
               fen: chess.fen(),
               turnColor: chess.turn() === "w" ? "white" : "black",
            });
            console.log(`📍 Position loaded: ${fenString}`);
         } else {
            console.error(`❌ Invalid FEN string: ${fenString}`);
         }
      },
      /**
       * Helper function to get current game status
       * USAGE: getGameStatus()
       */
      getGameStatus() {
         return {
            isCheckmate: chess.in_checkmate(),
            isCheck: chess.in_check(),
            isStalemate: chess.in_stalemate(),
            currentTurn: chess.turn() === "w" ? "white" : "black",
            moveCount: chess.moves().length,
            history: chess.history(),
         };
      },
   };
}
