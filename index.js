// Justin Salsbery
// 10-24-22

"use strict";

/*
TODO:
Clear as global
Hide scroll bar
Line overlow???
Print color...
*/

// ***************************************************************************
// SHELL CODE
// ***************************************************************************

const terminal = new class Terminal {
   constructor(topShell, bottomShell) {
      this.topShell = topShell;
      this.bottomShell = bottomShell;
      this.response = ""; // class variables

      Terminal.enterPressed = new Event("enter_pressed"); // static variable

      // setup action listeners
      const self = this; // "this" binds to other values in subsequent function calls
      document.getElementById("content-game").onclick = function() {
         self.bottomShell.focus();
      }
      self.bottomShell.onkeydown = function(key) {
         if (key.keyCode == 13) { // 13 == "enter"
            self.bottomShell.dispatchEvent(Terminal.enterPressed);
            self.response = self.bottomShell.value;
            self.bottomShell.value = "";
            self.printLine("> " + self.response);
         }
      }
   }

   // Solution modified from Claude at https://stackoverflow.com/questions/6902334/how-to-let-javascript-wait-until-certain-event-happens
   input() { 
      return new Promise((resolve) => {
         const listener = () => {
            this.bottomShell.removeEventListener("enter_pressed", listener);
            resolve();
         }
         this.bottomShell.addEventListener("enter_pressed", listener);
      })
   }

   async read() {
      await this.input();
      return this.response;
   }

   print(str) {
      this.topShell.innerText += str;
      this.topShell.scrollTo(0, this.topShell.scrollHeight);
   }

   printLine(str) {
      this.print(str + "\n");
   }

   clear() {
      this.topShell.innerText = "";
   }

} (document.getElementById("content-game-top"), 
   document.getElementById("content-game-bottom-shell"));

// ***************************************************************************
// BLACKJACK GAME
// ***************************************************************************

