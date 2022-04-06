import { getWord, getList } from "./api.js";

const word = await getWord();
const words = await getList();

console.log(word, words)

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
const guessGrid = Array.from(document.querySelector(".letter-grid").children)
let currentLine = 0;
let currentGuess = [];
let game = true;

const input = document.querySelector(".input")
const keys = Array.from(document.querySelectorAll(".key"));
document.addEventListener('keydown', (e) => {
    if (game) {
    const char = e.key;
    if (char === 'Enter' && currentGuess.length === 5 && game === true) {
        const guess = currentGuess.join('');
        if (!words.includes(guess)) {
            alert('not a word')
        } else {
            let numberCorrect = 0;
            Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                let status;
                if (word[index] === currentGuess[index].toLowerCase()) { status = 2; }
                else if (word.includes(currentGuess[index].toLowerCase())) { status = 1; }
                else { status = 0 }
                    letter.innerHTML = currentGuess[index];
                if (status === 2) {
                    letter.style.background = 'green';
                    numberCorrect++;
                };
                if (status === 1) letter.style.background = 'yellow';
                if (status === 0) letter.style.background = 'grey';
                keys.forEach(key => {
                    if (key.innerHTML === currentGuess[index].toLowerCase()) {
                        if (status === 2) key.style.background = 'green';
                        if (status === 1 && key.style.background !== 'green') key.style.background = 'yellow';
                        if (status === 0 && key.style.background !== 'green') key.style.background = 'grey';
                    }
                })
                if (numberCorrect === 5) setTimeout(() => {
                    alert("You won!");
                    game = false;
                })
            })

            currentLine++;
            if (currentLine > 5) game = false;
            currentGuess = [];
        }
    }
    if (char === 'Backspace') {
        currentGuess.pop();
    } else if (currentGuess.length < 5 && alphabet.includes(char)) {
        currentGuess.push(char);
    }
    Array.from(input.children).forEach((letter, index) => {
        if (currentGuess[index]) {
            letter.innerHTML = currentGuess[index];
        } else {
            letter.innerHTML = '&nbsp;';
        }
    })
    }
})