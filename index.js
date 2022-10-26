// Justin Salsbery
// 10-24-22

// Program not found... Try/Catch

// Can I wait for enter and on enter return the result?

"use strict";

const topShell = document.getElementById("content-game-top");
const bottomShell = document.getElementById("content-game-bottom-shell");
let context = null;

document.getElementById("content-game").onclick = function() {
   bottomShell.focus();
}

bottomShell.onkeydown = function(key) {
   if (key.keyCode == 13) { // 13 == "enter"
      let arg = bottomShell.value;
      terminalPrintLine("> " + arg);

      const call = context;
      context = null;
      if (call !== null) {
         call(arg);
         return;
      }
      command(arg);
   }
}

function command(arg) {
   if (arg == "clear") {
      topShell.innerText = "";
      bottomShell.value = "";
   } else if (arg == "ls") {
      terminalPrintLine("blackjack.out");
   } else if (arg == "pwd") {
      terminalPrintLine("/");
   } else if (arg.startsWith("mkdir") || arg.startsWith("touch") 
   || arg.startsWith("rm") || arg.startsWith("cp") || arg.startsWith("man")
   || arg.startsWith("cd")) {
      terminalPrintLine("Access denied");
   } else if (arg.startsWith("echo")) {
      terminalPrintLine(arg.slice(5));
   } else if (arg == "help") {
      terminalPrintLine("Call ./program_name.out");
   } else if (arg.startsWith("./")) {
      let params = arg.split(" "); 
      arg = params[0].slice(2); // grab first index, drop "./"
      arg = arg.split(".")[0]; // grabs all characters until "."
      params.shift(); // drop first index, first index stored in arg 
      params.forEach(function(param, index) { // wrap each parameter in quotes
         params[index] = "\"" + param + "\"";
      });
      params = "[" + params + "]"; // handle as an array
      buildFunctionCall(arg, params);
   } else if (arg == "" || arg.startsWith(" ")) {
   } else {
      terminalPrintLine("Command not found.");
   }
}

function buildFunctionCall(fnct, params) {
   const call = fnct + "(" + params + ");";
   eval(call); // this isn't "safe" is such matters
}

function terminalPrint(str) {
   topShell.innerText += str;
   topShell.scrollTo(0, topShell.scrollHeight);
   bottomShell.value = "";
}

function terminalPrintLine(str) {
   terminalPrint(str + "\n");
}

// ***************************************************************************
// BLACKJACK GAME
// ***************************************************************************

function blackjack(args) {

}

// let playerHand = 0
// let dealerHand = 0

// // does not handle aces being either 1 or 11
// // does not handle all faces being 10
// // with this current architecture, this would require a new context
// function drawCard(hand) {
//    hand += Math.floor(1 + (Math.random() * 11));
//    return hand;
// }

// function checkPlayerHand() {
//    if (playerHand > 21) {
//       terminalPrintLine("Bad luck. You've lost.")
//       return false;
//    }
//    terminalPrintLine("Your hand is: " + playerHand);
//    return true;
// }

function blackjackMenu(arg) {
   if (arg == 0) {
      terminalPrintLine("Hello there!");
      terminalPrintLine("Welcome to Blackjack v0.1:");
      terminalPrintLine("Enter 0 for this menu");
      terminalPrintLine("Enter 1 to restart game");
      terminalPrintLine("Enter 2 to draw another card");
      terminalPrintLine("Enter 3 to end drawing");
      terminalPrintLine("Enter 4 to exit");
   } else if (arg == 1) { // restart game
      playerHand = 0;
      playerHand = drawCard(playerHand);
      playerHand = drawCard(playerHand);
      checkPlayerHand();
   } else if (arg == 2) { // draw a card
      playerHand = drawCard(playerHand);
      checkPlayerHand();
   } else if (arg == 3) { // end turn
      if (checkPlayerHand()) {
         dealerHand = 0;
         while (dealerHand <= playerHand) {
            dealerHand = drawCard(dealerHand);
         }
         terminalPrintLine("Dealer scored: " + dealerHand);
         if (dealerHand <= 21 && dealerHand > playerHand) {
            terminalPrintLine("Dealer won.");
         } else {
            terminalPrintLine("You've won!");
         }
         // can repeat dealer's turn without player redrawing...
      }
   } else if (arg == 4) { // exit game
      terminalPrintLine("Goodbye!");
      context = null;
   }
}

blackjackMenu(0);