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
let response;
bottomShell.onkeydown = function(key) {
   if (key.keyCode == 13) { // 13 == "enter"
      bottomShell.dispatchEvent(enterPressed);
      response = bottomShell.value;
      bottomShell.value = "";
      printLine("> " + response);
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
   return response;
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

