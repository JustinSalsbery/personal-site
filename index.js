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
         if (self.selectionMode == true) {
            switch (key.keyCode) {
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
            if (key.keyCode == 13) { // ENTER - 13
               if (self.bottomShell.value == "clear") {
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
      if (withNewLine == true) { // must be .innerHTML and not .innerText
         this.topShell.innerHTML += str + "<br>"; // '\n' is <br> in HTML
      } else {
         this.topShell.innerHTML += str;
      }
      this.topShell.scrollTo(0, this.topShell.scrollHeight);
   }

   printColor(str, hex, withNewLine) { // hex should be a string
      if (withNewLine == true) {
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
   while (true) {
      terminal.print("Menu options:", true);
      terminal.print("blackjack - To play a game of blackjack.", true);
      terminal.print("exit - To exit this menu.", true);
      switch ((await terminal.read()).toLowerCase()) {
         case "blackjack":
            //
            break;
         case "exit":
            return;
         default:
      }
      terminal.clear();
   }
})();

// ***************************************************************************
// BLACKJACK GAME
// ***************************************************************************

