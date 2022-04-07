import { getWord, getList } from "./api.js";
import Modal from "./Modal.js";

const modal = new Modal('.modal')

const word = await getWord();
const words = await getList();

let pastGuesses = localStorage.getItem('guesses') ? localStorage.getItem('guesses') : '';
if (!localStorage.getItem('word')) localStorage.setItem('word', word);
if (localStorage.getItem('word') !== word) {
    localStorage.setItem('word', word);
    localStorage.setItem('guesses', '');
}
const pastGuessArray = pastGuesses.split(' ');
console.log(pastGuessArray)

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
const guessGrid = Array.from(document.querySelector(".letter-grid").children)

let currentLine = 0;
let currentGuess = [];
let game = true;
let win = false;

const input = document.querySelector(".input")
const keys = Array.from(document.querySelectorAll(".key"));

for (let guess of pastGuessArray) {
    if (guess.length) {
        console.log(currentLine, game)
        let numberCorrect = 0;
        Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
            let status;
            setTimeout(() => {
                if (word[index] === guess[index].toLowerCase()) { status = 2; }
                else if (word.includes(guess[index].toLowerCase())) { status = 1; }
                else { status = 0 }
                    letter.innerHTML = guess[index];
                    letter.classList.add('letter--filled')
                if (status === 2) {
                    letter.style.background = 'var(--green)';
                    numberCorrect++;
                };
                if (status === 1) letter.style.background = 'var(--yellow)';
                if (status === 0) letter.style.background = 'grey';
                keys.forEach(key => {
                    if (key.innerHTML === guess[index].toLowerCase()) {
                        if (status === 2) key.style.background = 'var(--green)';
                        if (status === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow';
                        if (status === 0 && key.style.background !== 'var(--green)') key.style.background = 'grey';
                    }
                })
                if (numberCorrect === 5) {
                    modal.open("<div class='modal-card'><h2>Nice job</h2></div>");
                    game = false;
                    win = true;
                }
            }, index * 200)
        })
        setTimeout(() => {
            currentLine++;
            if (currentLine > 5 && !win) {
                game = false;
                modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2></div>`);
            }
            currentGuess = [];
        }, 1200)
    }
}
document.addEventListener('keydown', (e) => {
    console.log("press")
    if (game) {
    const char = e.key;
    if (char === 'Enter' && currentGuess.length === 5 && game === true) {
        const guess = currentGuess.join('');
        if (!words.includes(guess)) {
            alert('not a word')
        } else {
            pastGuesses += currentGuess.join('');
            pastGuesses += ' ';
            localStorage.setItem('guesses', pastGuesses)
            let numberCorrect = 0;
            Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                setTimeout(() => {
                    let status;
                    if (word[index] === currentGuess[index].toLowerCase()) { status = 2; }
                    else if (word.includes(currentGuess[index].toLowerCase())) { status = 1; }
                    else { status = 0 }
                        letter.innerHTML = currentGuess[index];
                        letter.classList.add('letter--filled');
                    if (status === 2) {
                        letter.style.background = 'var(--green)';
                        numberCorrect++;
                    };
                    if (status === 1) letter.style.background = 'var(--yellow)';
                    if (status === 0) letter.style.background = 'grey';
                    keys.forEach(key => {
                        if (key.innerHTML === currentGuess[index].toLowerCase()) {
                            if (status === 2) key.style.background = 'var(--green)';
                            if (status === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow)';
                            if (status === 0 && key.style.background !== 'var(--green)') key.style.background = 'grey';
                        }
                    })
                    if (numberCorrect === 5) {
                        modal.open("<div class='modal-card'><h2>Nice job</h2></div>");
                        game = false;
                        win = true;
                    }
                }, index * 200)
            })
            setTimeout(() => {
                currentLine++;
                if (currentLine > 5 && !win) {
                    game = false;
                    modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2></div>`);
                }
                currentGuess = [];
            }, 1200)
        }
    }
    if (char === 'Backspace') {
        currentGuess.pop();
    } else if (currentGuess.length < 5 && alphabet.includes(char)) {
        currentGuess.push(char);
    }
    Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
        if (currentGuess[index]) {
            letter.innerHTML = currentGuess[index];
        } else {
            letter.innerHTML = '&nbsp;';
        }
    })
    } else {
        currentGuess.push(e.key);
        console.log(currentGuess)
        if (currentGuess.join('') === 'reset') {
            game = true;
            localStorage.clear();
            currentGuess = [];
            currentLine = 0;
        }
    }
})
keys.forEach(key => {
    key.addEventListener('touchend', () => {
        key.classList.remove('touched');
    })
})
keys.forEach(key => {
    key.addEventListener('touchstart', () => {
        key.classList.add('touched');
        if (game) {
        const char = key.innerHTML;
        if (char === 'Enter' && currentGuess.length === 5 && game === true) {
            const guess = currentGuess.join('');
            if (!words.includes(guess)) {
                alert('not a word')
            } else {
                pastGuesses += currentGuess.join('');
                pastGuesses += ' ';
                localStorage.setItem('guesses', pastGuesses)
                let numberCorrect = 0;
                Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                    setTimeout(() => {
                        let status;
                        if (word[index] === currentGuess[index].toLowerCase()) { status = 2; }
                        else if (word.includes(currentGuess[index].toLowerCase())) { status = 1; }
                        else { status = 0 }
                            letter.innerHTML = currentGuess[index];
                            letter.classList.add('letter--filled');
                        if (status === 2) {
                            letter.style.background = 'var(--green)';
                            numberCorrect++;
                        };
                        if (status === 1) letter.style.background = 'var(--yellow)';
                        if (status === 0) letter.style.background = 'grey';
                        keys.forEach(key => {
                            if (key.innerHTML === currentGuess[index].toLowerCase()) {
                                if (status === 2) key.style.background = 'var(--green)';
                                if (status === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow)';
                                if (status === 0 && key.style.background !== 'var(--green)') key.style.background = 'grey';
                            }
                        })
                        if (numberCorrect === 5) {
                            modal.open("<div class='modal-card'><h2>Nice job</h2></div>");
                            game = false;
                            win = true;
                        }
                    }, index * 200)
                })
                setTimeout(() => {
                    currentLine++;
                    if (currentLine > 5 && !win) {
                        game = false;
                        modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2></div>`);
                    }
                    currentGuess = [];
                }, 1200)
            }
        }
        if (char === 'Backspace') {
            currentGuess.pop();
        } else if (currentGuess.length < 5 && alphabet.includes(char)) {
            currentGuess.push(char);
        }
        Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
            if (currentGuess[index]) {
                letter.innerHTML = currentGuess[index];
            } else {
                letter.innerHTML = '&nbsp;';
            }
        })
        } else {
            currentGuess.push(key.innerHTML);
            console.log(currentGuess)
            if (currentGuess.join('') === 'reset') {
                game = true;
                localStorage.clear();
                currentGuess = [];
                currentLine = 0;
            }
        }
    })
})