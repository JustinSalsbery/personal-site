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

      Terminal.enterPressed = new Event("enter_pressed"); // static variable

      // setup action listeners
      const self = this; // "this" binds to other values in subsequent function calls
      document.getElementById("content-game").onclick = function() {
         self.bottomShell.focus();
      }
      self.bottomShell.onkeydown = function(key) {
         if (key.keyCode == 13) { // 13 == "enter"
            if (self.bottomShell.value == "clear") {
               self.clear();
            } else {
               self.bottomShell.dispatchEvent(Terminal.enterPressed);
               self.lastInput = self.bottomShell.value;
               self.print("> " + self.lastInput, true);
            }
            self.bottomShell.value = "";
         }
      }
   }

   // Solution modified from Claude at https://stackoverflow.com/questions/6902334/how-to-let-javascript-wait-until-certain-event-happens
   async read() {
      await new Promise((resolve) => {
         const listener = () => {
            this.bottomShell.removeEventListener("enter_pressed", listener);
            resolve();
         }
         this.bottomShell.addEventListener("enter_pressed", listener);
      });
      return this.lastInput;
   }

   print(str, withNewLine) {
      if (withNewLine == true) {
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
// BLACKJACK GAME
// ***************************************************************************

