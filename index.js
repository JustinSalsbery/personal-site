// Justin Salsbery
// 10-24-22

"use strict";

// ***************************************************************************
// SHELL CODE
// ***************************************************************************

const terminal = new class Terminal {
   constructor(topShell, bottomShell) {
      this.topShell = topShell;
      this.bottomShell = bottomShell;
      this.lastInput = ""; // class variables
      this.selectionMode; // true - read arrow keys; else - read characters

      Terminal.keyPressed = new Event("key_pressed"); // static variables

      // setup action listeners
      const self = this; // "this" binds to other values in subsequent function calls
      document.getElementById("content-game").onclick = function() {
         self.bottomShell.focus();
      }
      self.bottomShell.onkeydown = function(key) {
         if(self.selectionMode == true) {
            switch(key.keyCode) {
               case 13:
                  self.lastInput = "ENTER";
                  break;
               case 37:
                  self.lastInput = "LEFT";
                  break;
               case 38:
                  self.lastInput = "UP";
                  break;
               case 39:
                  self.lastInput = "RIGHT";
                  break;
               case 40:
                  self.lastInput = "DOWN";
                  break;
               default:
                  self.bottomShell.value = "";
                  return;
            }
            self.bottomShell.value = "";
            self.bottomShell.dispatchEvent(Terminal.keyPressed);
         } else { // DEFAULT mode
            if(key.keyCode == 13) { // ENTER - 13
               if(self.bottomShell.value == "clear") {
                  self.bottomShell.value = "";
                  self.clear();
                  return;
               } else {
                  self.lastInput = self.bottomShell.value;
                  self.bottomShell.value = "";
                  self.print("> " + self.lastInput, true);
                  self.bottomShell.dispatchEvent(Terminal.keyPressed);
                  return;
               }
            }
         }
      }
   }

   // Solution modified from Claude at https://stackoverflow.com/questions/6902334/how-to-let-javascript-wait-until-certain-event-happens
   // Modes: 1 - read arrow keys; else - read characters
   async read(selectionMode) {
      this.selectionMode = selectionMode;
      await new Promise((resolve) => {
         const listener = () => {
            this.bottomShell.removeEventListener("key_pressed", listener);
            resolve();
         }
         this.bottomShell.addEventListener("key_pressed", listener);
      });
      return this.lastInput;
   }

   print(str, withNewLine) {
      if(withNewLine == true) { // must be .innerHTML and not .innerText
         this.topShell.innerHTML += str + "<br>"; // '\n' is <br> in HTML
      } else {
         this.topShell.innerHTML += str;
      }
      this.topShell.scrollTo(0, this.topShell.scrollHeight);
   }

   printColor(str, hex, withNewLine) { // hex should be a string
      if(withNewLine == true) {
         this.topShell.innerHTML += `<div style="color:#${hex}">${str}</div><br>`;
      } else {
         this.topShell.innerHTML += `<div style="color:#${hex}">${str}</div>`;
      }
      this.topShell.scrollTo(0, this.topShell.scrollHeight);
   }

   clear() {
      this.topShell.innerHTML = "";
   }

} (document.getElementById("content-game-top"), 
   document.getElementById("content-game-bottom-shell"));

// ***************************************************************************
// MENU
// ***************************************************************************

(async function() {
   terminal.print("Hello, welcome to my site!<br>", true);
   while(true) {
      terminal.print("Menu options:", true);
      terminal.print("blackjack - To play a game of blackjack.", true);
      terminal.print("exit - To exit this menu.", true);
      switch((await terminal.read()).toLowerCase()) {
         case "blackjack":
            await(new Blackjack()).menu();
            break;
         case "exit":
            terminal.clear();
            return;
         default:
      }
      terminal.clear();
   }
})();

// ***************************************************************************
// BLACKJACK GAME
// ***************************************************************************

class Blackjack {
   constructor() {
      this.hand = 0;

      terminal.clear();
      terminal.printColor("Blackjack v0.2", "ffcccc", true);
   }

   async menu() {
      while(true) {
         terminal.print("<br>Options:", true);
         terminal.print("0 - Exit", true);
         terminal.print("1 - New game", true);
         terminal.print("2 - Hit", true);
         terminal.print("3 - Stop", true);
         switch(await terminal.read()) {
            case "0":
               return;
            case "1":
               terminal.print("<br>");
               await this.newGame();
               break;
            case "2":
               terminal.print("<br>");
               if(this.needRestart()) { break; }
               this.hand += await this.hit();
               terminal.print("Current hand: " + this.hand, true);
               if(this.hand > 21) { 
                  this.hand = 0;
                  terminal.printColor("You've lost...", "ffcccc", true);
               }
               break;
            case "3":
               terminal.print("<br>");
               if(this.needRestart()) { break; }
               this.dealerDraws();
               break;
            default:
         }
      }
   }

   async newGame() {
      this.hand = 0;
      this.hand += await this.hit();
      this.hand += await this.hit();
      terminal.print("Current hand: " + this.hand, true);
   }

   async hit() {
      const card = Math.floor(Math.random()*13+1);
      if(card == 1) { // ace is worth either 1 or 11
         terminal.print("Current hand: " + this.hand, true);
         terminal.printColor("Ace drawn!", "ccffcc");
         terminal.print(" Enter either 1 or 11 ");
         let input;
         while((input = await terminal.read()) != "1" && input != "11") {
            terminal.print("Enter either 1 or 11 ");
         }
         return Number(input);
      } else if(card < 11) { 
         terminal.print(card + " drawn.", true);
         return card;
      } else { // face cards are all worth 10, right?
         if(card == 11) {
            terminal.print("Jack drawn.", true);
         } else if(card == 12) {
            terminal.print("Queen drawn.", true);
         } else {
            terminal.print("King drawn.", true);
         }
         return 10;
      }
   }

   needRestart() {
      if(this.hand == 0) { // error checking
         terminal.print("Please start a new game.", true);
         return true;
      }
      return false;
   }

   dealerDraws() {
      let dealer = 0
      while(dealer < this.hand ||
         (dealer == this.hand && dealer < 16)) {
         const card = Math.floor(Math.random()*13+1);
         if(card == 1) { 
            if(dealer < 11) { 
               dealer += 11;
            } else {
               dealer += 1;
            }
         } else if(card < 11) {
            dealer += card;
         } else {
            dealer += 10;
         }
      }
      terminal.print("You drew: " + this.hand, true);
      terminal.print("Dealer drew: " + dealer, true);
      if(dealer == this.hand) {
         terminal.print("You've tied.", true);
      } else if(dealer < 22) {
         terminal.printColor("You've lost...", "ffcccc", true);
      } else {
         terminal.printColor("You've won!", "ccffcc", true);
      }
      this.hand = 0;
   }
}
