// Justin Salsbery
// 10-24-22

"use strict";

// ***************************************************************************
// SHELL CODE
// ***************************************************************************

const topShell = document.getElementById("content-game-top");
const bottomShell = document.getElementById("content-game-bottom-shell");

document.getElementById("content-game").onclick = function() {
   bottomShell.focus();
}

const enterPressed = new Event("enter_pressed");
bottomShell.onkeydown = function(key) {
   if (key.keyCode == 13) { // 13 == "enter"
      bottomShell.dispatchEvent(enterPressed);
   }
}

// Solution modified from Claude at https://stackoverflow.com/questions/6902334/how-to-let-javascript-wait-until-certain-event-happens
function input() { 
   return new Promise((resolve) => {
      const listener = () => {
         bottomShell.removeEventListener("enter_pressed", listener);
         resolve();
      }
      bottomShell.addEventListener("enter_pressed", listener);
   })
}

async function read() {
   await input();
   const result = bottomShell.value;
   bottomShell.value = "";
   printLine("> " + result);
   return result;
}

function print(str) {
   topShell.innerText += str;
   topShell.scrollTo(0, topShell.scrollHeight);
}

function printLine(str) {
   print(str + "\n");
}

function clear() {
   topShell.innerText = "";
}

// ***************************************************************************
// BLACKJACK GAME
// ***************************************************************************

