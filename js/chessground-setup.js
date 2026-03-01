/**
 * @fileoverview Chessground Chess Board Setup with Chess.js Integration
 *
 * This module initializes a fully-featured chess board using Chessground with chess.js
 * for proper move validation. It provides:
 *
 * 1. LEGAL MOVE VALIDATION - Only valid chess moves are allowed
 * 2. SELF-CAPTURE PREVENTION - Cannot capture your own pieces
 * 3. POSSIBLE MOVE HIGHLIGHTS - Visual indicators for valid moves when a piece is selected
 * 4. TURN-BASED PLAY - Only the current player's pieces can be moved
 * 5. CHECK/CHECKMATE DETECTION - Automatically detects and highlights check
 * 6. MOVE HISTORY TRACKING - Keeps track of all moves made
 */

import { Chessground } from "/js/chessground.min.js";

/**
 * Creates a Chess instance for move validation and game state management.
 * This uses the global Chess object provided by the chess.js script tag in index.html.
 *
 * @returns {Object|null} A Chess instance from chess.js or null if not found
 */

function createChessEngine() {
   try {
      // 1. Try global window.Chess (CDN or script tag)
      if (typeof window !== "undefined" && typeof window.Chess === "function") {
         return new window.Chess();
      }
      // 2. Try global Chess (sometimes available in non-module scripts)
      if (typeof Chess === "function") {
         return new Chess();
      }
      // 3. Try importing from npm (if bundled)
      try {
         // Only works if chess.js is installed and bundled
         // eslint-disable-next-line
         const ChessModule =
            typeof require !== "undefined" ? require("chess.js") : null;
         if (ChessModule && typeof ChessModule.Chess === "function") {
            return new ChessModule.Chess();
         }
         if (ChessModule && typeof ChessModule === "function") {
            return new ChessModule();
         }
      } catch (npmErr) {
         // Ignore if not available
      }
      // No dynamic import fallback for browser code
      console.error(
         "❌ Chess.js constructor not found. Please ensure the chess.js script is loaded or installed.",
      );
      return null;
   } catch (error) {
      console.error("❌ Error initializing Chess engine:", error);
      return null;
   }
}

/**
 * Builds a Map of legal destinations for all squares using the chess engine.
 *
 * @param {Object} chess - The Chess engine instance
 * @returns {Map<string, Array<string>>} Map of square -> valid destination squares
 */
function getLegalDestinationsMap(chess) {
   const dests = new Map();
   if (
      !chess ||
      typeof chess.moves !== "function" ||
      !Array.isArray(chess.SQUARES)
   ) {
      console.error("❌ Invalid chess engine or missing SQUARES property.");
      return dests;
   }
   chess.SQUARES.forEach((square) => {
      try {
         const moves = chess.moves({ square, verbose: true });
         if (moves.length) {
            dests.set(
               square,
               moves.map((m) => m.to),
            );
         }
      } catch (err) {
         console.error(`❌ Error getting moves for square ${square}:`, err);
      }
   });
   return dests;
}

/**
 * Initializes the Chessground chess board with full feature support.
 *
 * @param {HTMLElement} boardElement - The DOM element where the chessboard will render
 * @returns {Object|null} Object containing the Chessground instance and Chess engine
 */
export function initializeChessboard(boardElement) {
   // 1. Validate environment
   if (!boardElement) {
      console.error("❌ Chessboard element not found.");
      return null;
   }

   // 2. Initialize Engine
   let chess = createChessEngine();

   // If dynamic import fallback returns a Promise, handle it
   if (chess && typeof chess.then === "function") {
      // Async fallback for dynamic import
      chess.then((instance) => {
         if (!instance) {
            boardElement.innerHTML =
               "<p style='color:red; padding:20px;'>Error: Chess engine (chess.js) failed to load. Check console.</p>";
            return null;
         }
         // Re-run initialization with loaded instance
         initializeChessboardWithInstance(boardElement, instance);
      });
      // Show loading message while waiting
      boardElement.innerHTML =
         "<p style='color:orange; padding:20px;'>Loading chess engine (chess.js)...</p>";
      return null;
   }

   if (!chess) {
      boardElement.innerHTML =
         "<p style='color:red; padding:20px;'>Error: Chess engine (chess.js) failed to load. Check console.</p>";
      return null;
   }

   // 3. Feature Configuration
   const featureConfig = {
      enableLegalMoveValidation: true,
      preventSelfCapture: true,
      showPossibleMoves: true,
      enforceTurnOrder: true,
      highlightCheck: true,
      highlightLastMove: true,
   };

   // 4. Chessground Configuration
   const config = {
      fen: chess.fen(),
      orientation: "white",
      turnColor: "white",
      animation: {
         enabled: true,
         duration: 250,
      },
      highlight: {
         lastMove: featureConfig.highlightLastMove,
         check: featureConfig.highlightCheck,
      },
      movable: {
         free: !featureConfig.enableLegalMoveValidation,
         color: featureConfig.enforceTurnOrder ? "white" : "both",
         showDests: featureConfig.showPossibleMoves,
         dests: featureConfig.enableLegalMoveValidation
            ? getLegalDestinationsMap(chess)
            : undefined,
         events: {
            after: (orig, dest, metadata) => {
               try {
                  // Handle the move in the engine
                  const moveResult = chess.move({
                     from: orig,
                     to: dest,
                     promotion: "q", // Auto-promote to queen for simplicity
                  });

                  if (!moveResult) {
                     // Revert illegal move if validation failed somehow
                     console.warn(`Illegal move ignored: ${orig}->${dest}`);
                     ground.set({
                        fen: chess.fen(),
                        movable: { dests: getLegalDestinationsMap(chess) },
                     });
                     return;
                  }

                  // Update board state
                  const isWhiteTurn = chess.turn() === "w";
                  ground.set({
                     fen: chess.fen(),
                     turnColor: isWhiteTurn ? "white" : "black",
                     movable: {
                        color: featureConfig.enforceTurnOrder
                           ? isWhiteTurn
                              ? "white"
                              : "black"
                           : "both",
                        dests: featureConfig.enableLegalMoveValidation
                           ? getLegalDestinationsMap(chess)
                           : undefined,
                     },
                  });

                  // Log status
                  if (chess.in_checkmate()) console.log("🏁 Checkmate!");
                  else if (chess.in_draw()) console.log("🤝 Draw!");
                  else if (chess.in_check()) console.log("⚠️ Check!");
               } catch (err) {
                  console.error("❌ Error processing move:", err);
                  alert(
                     "An error occurred while processing your move. See console for details.",
                  );
               }
            },
         },
      },
      draggable: {
         enabled: true,
         showGhost: true,
         distance: 3,
         autoDistance: true,
         deleteOnDropOff: false,
      },
      selectable: {
         enabled: true,
      },
      premovable: {
         enabled: true,
         showDests: true,
      },
   };

   // 5. Initialize Board
   const ground = Chessground(boardElement, config);

   console.log("✅ Chessboard initialized with Features:", featureConfig);

   // 6. Return Public API
   return {
      ground,
      chess,
      featureConfig,
      resetBoard() {
         try {
            chess.reset();
            ground.set({
               fen: chess.fen(),
               turnColor: "white",
               movable: {
                  color: featureConfig.enforceTurnOrder ? "white" : "both",
                  dests: featureConfig.enableLegalMoveValidation
                     ? getLegalDestinationsMap(chess)
                     : undefined,
               },
            });
         } catch (err) {
            console.error("❌ Error resetting board:", err);
            alert(
               "An error occurred while resetting the board. See console for details.",
            );
         }
      },
      loadFEN(fen) {
         try {
            if (chess.load(fen)) {
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
                        ? getLegalDestinationsMap(chess)
                        : undefined,
                  },
               });
               return true;
            }
         } catch (err) {
            console.error("❌ Error loading FEN:", err);
            alert(
               "An error occurred while loading the position. See console for details.",
            );
         }
         return false;
      },
      getGameStatus() {
         try {
            return {
               isCheckmate: chess.in_checkmate(),
               isCheck: chess.in_check(),
               isDraw: chess.in_draw(),
               currentTurn: chess.turn() === "w" ? "white" : "black",
               history: chess.history(),
            };
         } catch (err) {
            console.error("❌ Error getting game status:", err);
            return {
               isCheckmate: false,
               isCheck: false,
               isDraw: false,
               currentTurn: "unknown",
               history: [],
            };
         }
      },
   };
}

/**
 * Helper for async dynamic import fallback.
 * @param {HTMLElement} boardElement
 * @param {Object} chessInstance
 */
function initializeChessboardWithInstance(boardElement, chessInstance) {
   // 3. Feature Configuration
   const featureConfig = {
      enableLegalMoveValidation: true,
      preventSelfCapture: true,
      showPossibleMoves: true,
      enforceTurnOrder: true,
      highlightCheck: true,
      highlightLastMove: true,
   };

   // 4. Chessground Configuration
   const config = {
      fen: chessInstance.fen(),
      orientation: "white",
      turnColor: "white",
      animation: {
         enabled: true,
         duration: 250,
      },
      highlight: {
         lastMove: featureConfig.highlightLastMove,
         check: featureConfig.highlightCheck,
      },
      movable: {
         free: !featureConfig.enableLegalMoveValidation,
         color: featureConfig.enforceTurnOrder ? "white" : "both",
         showDests: featureConfig.showPossibleMoves,
         dests: featureConfig.enableLegalMoveValidation
            ? (square) => getLegalMovesForSquare(chessInstance, square)
            : undefined,
         events: {
            after: (orig, dest, metadata) => {
               const moveResult = chessInstance.move({
                  from: orig,
                  to: dest,
                  promotion: "q",
               });

               if (!moveResult) {
                  ground.set({ fen: chessInstance.fen() });
                  return;
               }

               const isWhiteTurn = chessInstance.turn() === "w";
               ground.set({
                  fen: chessInstance.fen(),
                  turnColor: isWhiteTurn ? "white" : "black",
                  movable: {
                     color: featureConfig.enforceTurnOrder
                        ? isWhiteTurn
                           ? "white"
                           : "black"
                        : "both",
                     dests: featureConfig.enableLegalMoveValidation
                        ? (square) =>
                             getLegalMovesForSquare(chessInstance, square)
                        : undefined,
                  },
               });

               if (chessInstance.in_checkmate()) console.log("🏁 Checkmate!");
               else if (chessInstance.in_draw()) console.log("🤝 Draw!");
               else if (chessInstance.in_check()) console.log("⚠️ Check!");
            },
         },
      },
      draggable: {
         enabled: true,
         showGhost: true,
         distance: 3,
         autoDistance: true,
         deleteOnDropOff: false,
      },
      selectable: {
         enabled: true,
      },
      premovable: {
         enabled: true,
         showDests: true,
      },
   };

   const ground = Chessground(boardElement, config);

   console.log(
      "✅ Chessboard initialized with Features (async):",
      featureConfig,
   );

   // Return API (async fallback)
   return {
      ground,
      chess: chessInstance,
      featureConfig,
      resetBoard() {
         chessInstance.reset();
         ground.set({
            fen: chessInstance.fen(),
            turnColor: "white",
            movable: {
               color: featureConfig.enforceTurnOrder ? "white" : "both",
            },
         });
      },
      loadFEN(fen) {
         if (chessInstance.load(fen)) {
            ground.set({
               fen: chessInstance.fen(),
               turnColor: chessInstance.turn() === "w" ? "white" : "black",
            });
            return true;
         }
         return false;
      },
      getGameStatus() {
         return {
            isCheckmate: chessInstance.in_checkmate(),
            isCheck: chessInstance.in_check(),
            isDraw: chessInstance.in_draw(),
            currentTurn: chessInstance.turn() === "w" ? "white" : "black",
            history: chessInstance.history(),
         };
      },
   };
}
