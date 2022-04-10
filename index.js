import {  getGordle } from "./api.js";
import Modal from "./Modal.js";

const modal = new Modal('.modal');

const game = async () => {
    const countdown = document.querySelector(".hours");
    const gordNumber = document.querySelector(".gordNumber");
    const gordle = await getGordle();
    const word = gordle.word;
    const words = gordle.list;
    const newTime = new Date().setTime(Date.now() + ((6 - gordle.timeToUpdate) * 60 * 60 * 1000));
    const currentTime = new Date();
    let secondsTill = (newTime - currentTime) / 1000;
    setInterval(() => {
        secondsTill--;
        const seconds = Math.floor(secondsTill % 60).toString().length > 1 ? Math.floor(secondsTill % 60) : '0' + Math.floor(secondsTill % 60).toString()
        const minutes = Math.floor((secondsTill / 60) % 60).toString().length > 1 ? Math.floor((secondsTill / 60) % 60) : '0' + Math.floor((secondsTill / 60) % 60).toString()
        countdown.innerText = `${Math.floor(secondsTill / 3600)}:${minutes}:${seconds}`;
    }, 1000)
    localStorage.setItem('currentWord', gordle.current);
    gordNumber.innerText = gordle.current;
    localStorage.setItem('tto', gordle.timeToUpdate);
    localStorage.setItem('lastTime', gordle.lastTime);
    // const word = await getWord();
    // const words = await getList();

    let pastGuesses = localStorage.getItem('guesses') ? localStorage.getItem('guesses') : '';
    if (!localStorage.getItem('word')) localStorage.setItem('word', word);
    if (localStorage.getItem('word') !== word) {
        localStorage.setItem('word', word);
        localStorage.setItem('guesses', '');
        localStorage.setItem('clipboardCode', '');
        localStorage.setItem('tto', gordle.timeToUpdate);
        localStorage.setItem('lastTime', gordle.lastTime);
        pastGuesses = '';
    }
    const pastGuessArray = pastGuesses.split(' ');

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
    const guessGrid = Array.from(document.querySelector(".letter-grid").children)

    let currentLine = 0;
    let currentGuess = [];
    let activeGame = true;
    let win = false;

    const keys = Array.from(document.querySelectorAll(".key"));

    const clipboardCodes = [];

    const defaultCheck = {};

    for (let i = 0; i < word.length; i++) {
        if (defaultCheck[word[i]]) {
            defaultCheck[word[i]].push(i);
        } else {
            defaultCheck[word[i]] = [i];
        }
    }

    for (let guess of pastGuessArray) {
        if (guess.length) {
            let numberCorrect = 0;
            const currentCheck = {};
            let statusArray = [0,0,0,0,0];

            for (let i = 0; i < word.length; i++) {
                if (currentCheck[word[i]]) {
                    currentCheck[word[i]].push(i);
                } else {
                    currentCheck[word[i]] = [i];
                }
            }
            for (let i = 0; i < guess.length; i++) {
                const currentLetter = guess[i].toLowerCase();
                if (currentCheck[currentLetter]) {
                    if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(i)) { 
                        statusArray[i] = 2; 
                        const removeIndex = currentCheck[currentLetter].indexOf(i);
                        currentCheck[currentLetter].splice(removeIndex, 1)
                    } else { statusArray[i] = 0; }
                } else { statusArray[i] = 0; }
            }
            for (let i = 0; i < guess.length; i++) {
                const currentLetter = guess[i].toLowerCase();
                if (currentCheck[currentLetter]) {
                    if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                        statusArray[i] = 1; 
                        currentCheck[currentLetter].push('yellowed')
                    } 
                } 
            }
            Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                // let status;
                // const currentLetter = guess[index].toLowerCase();
                setTimeout(() => {
                    // if (currentCheck[currentLetter]) {
                    //     if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(index)) { 
                    //         status = 2; 
                    //         const removeIndex = currentCheck[currentLetter].indexOf(index);
                    //         currentCheck[currentLetter].splice(removeIndex, 1)
                    //     }
                    //     else if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                    //         status = 1; 
                    //         currentCheck[currentLetter].push('yellowed')
                    //     }
                    //     else { status = 0 }
                    // } else { status = 0}
                    letter.innerHTML = guess[index];
                    letter.classList.add('letter--filled')
                    if (statusArray[index] === 2) {
                        letter.style.background = 'var(--green)';
                        numberCorrect++;
                    };
                    if (statusArray[index] === 1) letter.style.background = 'var(--yellow)';
                    if (statusArray[index] === 0) letter.style.background = 'grey';
                    keys.forEach(key => {
                        if (key.innerHTML === guess[index].toLowerCase()) {
                            if (statusArray[index] === 2) key.style.background = 'var(--green)';
                            if (statusArray[index] === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow';
                            if (statusArray[index] === 0 && key.style.background !== 'var(--green)' && key.style.background !== 'var(--yellow)') key.style.background = 'grey';
                        }
                    })
                }, index * 200)
            })
            setTimeout(() => {
                if (numberCorrect === 5 && currentLine <= 6) {
                    modal.open("<div class='modal-card'><h2>Nice job</h2><p>SHARE</p></div>");
                    activeGame = false;
                    win = true;
                } else if (currentLine > 5 && !win) {
                    activeGame = false;
                    modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2><p>SHARE</p></div>`);
                }
                currentGuess = [];
                statusArray = [0,0,0,0,0];
            }, 1200)
            currentLine++;
        }
    }
    document.addEventListener('keydown', (e) => {
        if (activeGame) {
        const char = e.key;
        if (char === 'Enter' && currentGuess.length === 5 && activeGame === true) {
            const guess = currentGuess.join('');
            if (!words.includes(guess)) {
                alert('not a word')
            } else {
                pastGuesses += currentGuess.join('');
                pastGuesses += ' ';
                localStorage.setItem('guesses', pastGuesses)
                let numberCorrect = 0;
                const currentCheck = {};
                let statusArray = [0,0,0,0,0];

                for (let i = 0; i < word.length; i++) {
                    if (currentCheck[word[i]]) {
                        currentCheck[word[i]].push(i);
                    } else {
                        currentCheck[word[i]] = [i];
                    }
                }
                for (let i = 0; i < guess.length; i++) {
                    const currentLetter = guess[i].toLowerCase();
                    if (currentCheck[currentLetter]) {
                        if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(i)) { 
                            statusArray[i] = 2; 
                            const removeIndex = currentCheck[currentLetter].indexOf(i);
                            currentCheck[currentLetter].splice(removeIndex, 1)
                        } else { statusArray[i] = 0; }
                    } else { statusArray[i] = 0; }
                }
                for (let i = 0; i < guess.length; i++) {
                    const currentLetter = guess[i].toLowerCase();
                    if (currentCheck[currentLetter]) {
                        if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                            statusArray[i] = 1; 
                            currentCheck[currentLetter].push('yellowed')
                        } 
                    } 
                }
                Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                    setTimeout(() => {
                        // let status;
                        // const currentLetter = guess[index].toLowerCase();
                        // if (currentCheck[currentLetter]) {
                        //     if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(index)) { 
                        //         status = 2; 
                        //         const removeIndex = currentCheck[currentLetter].indexOf(index);
                        //         currentCheck[currentLetter].splice(removeIndex, 1)
                        //     }
                        //     else if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                        //         status = 1; 
                        //         currentCheck[currentLetter].push('yellowed')
                        //     }
                        //     else { status = 0 }
                        // } else { status = 0}
                        letter.innerHTML = currentGuess[index];
                        letter.classList.add('letter--filled');
                        if (statusArray[index] === 2) {
                            letter.style.background = 'var(--green)';
                            numberCorrect++;
                        };
                        if (statusArray[index] === 1) letter.style.background = 'var(--yellow)';
                        if (statusArray[index] === 0) letter.style.background = 'grey';
                        keys.forEach(key => {
                            if (key.innerHTML === currentGuess[index].toLowerCase()) {
                                if (statusArray[index] === 2) key.style.background = 'var(--green)';
                                if (statusArray[index] === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow)';
                                if (statusArray[index] === 0 && key.style.background !== 'var(--green)' && key.style.background !== 'var(--yellow)') key.style.background = 'grey';
                            }
                        })
                        clipboardCodes.push(status);
                        localStorage.setItem('clipboardCode', clipboardCodes.join(' '))
                        if (numberCorrect === 5) {
                            modal.open("<div class='modal-card'><h2>Nice job</h2><p>SHARE</p></div>");
                            activeGame = false;
                            win = true;
                        }
                    }, index * 200)
                })
                setTimeout(() => {
                    currentLine++;
                    if (currentLine > 5 && !win) {
                        activeGame = false;
                        modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2><p onclick=copyText()'>SHARE</p></div>`);
                    }
                    currentGuess = [];
                    statusArray = [0,0,0,0,0]
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
            if (currentGuess.join('') === 'reset') {
                activeGame = true;
                localStorage.clear();
                currentGuess = [];
                currentLine = 0;
            }
        }
    })
    keys.forEach(key => {
        key.addEventListener('touchstart', () => {
            key.classList.add('touched');
        })
    })
    keys.forEach(key => {
        key.addEventListener('touchend', () => {
            key.classList.remove('touched');
        })
    })
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (activeGame) {
            const char = key.innerHTML;
            if (char === 'Enter' && currentGuess.length === 5 && activeGame === true) {
                const guess = currentGuess.join('');
                if (!words.includes(guess)) {
                    alert('not a word')
                } else {
                    pastGuesses += currentGuess.join('');
                    pastGuesses += ' ';
                    localStorage.setItem('guesses', pastGuesses)
                    let numberCorrect = 0;
                    const currentCheck = {};
                    let statusArray = [0,0,0,0,0]

                    for (let i = 0; i < word.length; i++) {
                        if (currentCheck[word[i]]) {
                            currentCheck[word[i]].push(i);
                        } else {
                            currentCheck[word[i]] = [i];
                        }
                    }
                    for (let i = 0; i < guess.length; i++) {
                        const currentLetter = guess[i].toLowerCase();
                        if (currentCheck[currentLetter]) {
                            if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(i)) { 
                                statusArray[i] = 2; 
                                const removeIndex = currentCheck[currentLetter].indexOf(i);
                                currentCheck[currentLetter].splice(removeIndex, 1)
                            } else { statusArray[i] = 0; }
                        } else { statusArray[i] = 0; }
                    }
                    for (let i = 0; i < guess.length; i++) {
                        const currentLetter = guess[i].toLowerCase();
                        if (currentCheck[currentLetter]) {
                            if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                                statusArray[i] = 1; 
                                currentCheck[currentLetter].push('yellowed')
                            } 
                        } 
                    }
                    Array.from(guessGrid[currentLine].children).forEach((letter, index) => {
                        setTimeout(() => {
                            // let status;
                            // const currentLetter = guess[index].toLowerCase();
                            // if (currentCheck[currentLetter]) {
                            //     if (currentCheck[currentLetter].length && currentCheck[currentLetter].includes(index)) { 
                            //         status = 2; 
                            //         const removeIndex = currentCheck[currentLetter].indexOf(index);
                            //         currentCheck[currentLetter].splice(removeIndex, 1)
                            //     }
                            //     else if (currentCheck[currentLetter].length && !currentCheck[currentLetter].includes('yellowed')) { 
                            //         status = 1; 
                            //         currentCheck[currentLetter].push('yellowed')
                            //     }
                            //     else { status = 0 }
                            // } else { status = 0}
                            letter.innerHTML = currentGuess[index];
                            letter.classList.add('letter--filled');
                            if (statusArray[index] === 2) {
                                letter.style.background = 'var(--green)';
                                numberCorrect++;
                            };
                            if (statusArray[index] === 1) letter.style.background = 'var(--yellow)';
                            if (statusArray[index] === 0) letter.style.background = 'grey';
                            keys.forEach(key => {
                                if (key.innerHTML === currentGuess[index].toLowerCase()) {
                                    if (statusArray[index] === 2) key.style.background = 'var(--green)';
                                    if (statusArray[index] === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow)';
                                    if (statusArray[index] === 0 && key.style.background !== 'var(--green)' && key.style.background !== 'var(--yellow)') key.style.background = 'grey';
                                }
                            })
                            clipboardCodes.push(statusArray[index]);
                            localStorage.setItem('clipboardCode', clipboardCodes.join(' '))
                            if (numberCorrect === 5) {
                                modal.open("<div class='modal-card'><h2>Nice job</h2><p>SHARE</p></div>");
                                activeGame = false;
                                win = true;
                            }
                        }, index * 200)
                    })
                    setTimeout(() => {
                        currentLine++;
                        if (currentLine > 5 && !win) {
                            activeGame = false;
                            modal.open(`<div class='modal-card'><h2>Bad job</h2><h2>word was '${word}' idiot</h2><p>SHARE</p></div>`);
                        }
                        currentGuess = [];
                        statusArray = [0,0,0,0,0]
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
                if (currentGuess.join('') === 'reset') {
                    activeGame = true;
                    localStorage.clear();
                    currentGuess = [];
                    currentLine = 0;
                }
            }
        })
    })
}
game();