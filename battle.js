import { checkReadyStatus, getGameData, getList, startGame, updateGame } from "./api.js";

const game = async () => {
    let clockRunning = false;
    // DEBUGGING CODE
    // await fetch("http://localhost:5000/battle", { 
    //     method: "DELETE",
    //     headers: {"Content-Type": "application/json"},
    //     body: null
    // }).then(console.log)


    // backend game creation / joining
    let gameData = await getGameData();
    document.querySelector('.hours').innerText = 'searching...'
    const opponentGrid = document.querySelector(".opponent").children[0]
    const word = gameData.word;
    const playerIndex = gameData.players.length - 1;
    const opponentIndex = gameData.players.length > 1 ? 0 : 1;
    const token = gameData.token;

    // starting loop to check if match has been found and start the game
    const matchmaker = setInterval(async () => {
        checkReadyStatus(token).then(async isReady => {
            if (isReady == true) {
                document.querySelector('.hours').innerText = 'Match Started!'
                gameData = await startGame({
                    token: token,
                    isRunning: true
                });
                clearInterval(matchmaker);
            }
            if (isReady == 'timeout') {
                alert('no one is playing please try again later');
                clearInterval(matchmaker);
            }
        })
    }, 5000)
    const updater = setInterval(() => {
        if (gameData.isRunning) {
            if (!clockRunning) {
                let secondsTill = (gameData.killTime - Date.now()) / 1000;
                const timer = setInterval(() => {
                    secondsTill--;
                    if (secondsTill < 1) clearInterval(timer)
                    const seconds = Math.floor(secondsTill % 60).toString().length > 1 ? Math.floor(secondsTill % 60) : '0' + Math.floor(secondsTill % 60).toString()
                    const minutes = Math.floor((secondsTill / 60) % 60).toString().length > 1 ? Math.floor((secondsTill / 60) % 60) : '0' + Math.floor((secondsTill / 60) % 60).toString()
                    document.querySelector('.hours').innerText = `${Math.floor(secondsTill / 3600)}:${minutes}:${seconds}`;
                }, 1000)
                clockRunning = true;
            }
            updateGame(gameData, playerIndex).then(res => res.json()).then(res => {
                gameData = res;
                if (gameData.winner) {
                    if (gameData.winner.playerName == playerIndex + 1) {
                        alert('you won')
                    } else {
                        alert(`your lost, the word was: ${word}`)
                    }
                    clearInterval(updater)
                } else {
                    if (!res.isRunning) {
                        alert(`draw, the word was: ${word}`)
                        clearInterval(updater)
                    } else {
                        gameData = res;
                    }
                }

                const currentCheck = {};
                let statusArray = [0,0,0,0,0];
                const guess = gameData.players[opponentIndex].lastGuess;

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
    
                if (guess) {
                    Array.from(opponentGrid.children).forEach((letter, index) => {
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
                        letter.classList.add('letter--filled--battle');
                        setTimeout(() => {letter.classList.remove('letter--filled--battle')}, 1000);
                        if (statusArray[index] === 2) {
                            letter.style.background = 'var(--green)';
                        };
                        if (statusArray[index] === 1) letter.style.background = 'var(--yellow)';
                        if (statusArray[index] === 0) letter.style.background = 'grey';
                    })
                }
                statusArray = [0,0,0,0,0];
            });
        }
    }, 1000)

    const handleKeypress = (e, mobile) => {
        if (gameData.isRunning) {
            const char = mobile ? e.innerHTML : e.key;
            if (char === 'Enter' && currentGuess.length === 5) {
                const guess = currentGuess.join('');
                if (!words.includes(guess)) {
                    alert('not a word')
                } else {
            //         pastGuesses += currentGuess.join('');
            //         pastGuesses += ' ';
            //         localStorage.setItem('guesses', pastGuesses)
                    gameData.players[playerIndex].lastGuess = guess;
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
                    Array.from(guessGrid.children).forEach((letter, index) => {
                        // let status;
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
                        letter.classList.add('letter--filled--battle');
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
                    })
                    if (numberCorrect === 5) {
                        console.log('correct')
                    } else {
                        currentGuess = [];
                        statusArray = [0,0,0,0,0];
                    }
                }
            }
            if (char === 'Backspace') {
                currentGuess.pop();
            } else if (currentGuess.length < 5 && alphabet.includes(char)) {
                currentGuess.push(char);
            }
            if (char !== 'Enter') {
                Array.from(guessGrid.children).forEach((letter, index) => {
                    letter.classList.remove('letter--filled--battle')
                    if (currentGuess[index]) {
                        letter.innerHTML = currentGuess[index];
                    } else {
                        letter.innerHTML = '&nbsp;';
                    }
                })
            }
        }
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
    const guessGrid = document.querySelector(".player").children[0]
    const words = await getList();
    let currentGuess = [];

    const keys = Array.from(document.querySelectorAll(".key"));

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
        key.addEventListener('click', () => handleKeypress(key, true))
    })
    document.addEventListener('keydown', (e) => handleKeypress(e, false))
}
game();