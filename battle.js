import { checkReadyStatus, getGameData, getList, startGame, updateGame } from "./api.js";
import { check, eloCalc } from "./helpers.js";
import Modal from "./modal.js";
const modal = new Modal('.modal');
const initialState = `
    <h2 class="opponentName">&nbsp;</h2>
    <div class="letter-grid opponent">
        <div class="letter-row">
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
        </div>
    </div>
    <div class="splitter">&nbsp;</div>

    <div class="prev-guess-bay">
        <div class="letter-grid small-grid">
            <div class="letter-row">
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
            </div>
        </div>
        <div class="letter-grid small-grid">
            <div class="letter-row">
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
            </div>
        </div>
        <div class="letter-grid small-grid">
            <div class="letter-row">
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
            </div>
        </div>
        <div class="letter-grid small-grid">
            <div class="letter-row">
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
                <div class="letter"></div>
            </div>
        </div>
    </div>
    
    <div class="letter-grid player">
        <div class="letter-row">
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
            <div class="letter">
                &nbsp;
            </div>
        </div>
    </div>
    <div class="keyboard">
        <div class="keyboard-row">
            <div class="key">q</div>
            <div class="key">w</div>
            <div class="key">e</div>
            <div class="key">r</div>
            <div class="key">t</div>
            <div class="key">y</div>
            <div class="key">u</div>
            <div class="key">i</div>
            <div class="key">o</div>
            <div class="key">p</div>
        </div>
        <div class="keyboard-row">
            <div class="key">a</div>
            <div class="key">s</div>
            <div class="key">d</div>
            <div class="key">f</div>
            <div class="key">g</div>
            <div class="key">h</div>
            <div class="key">j</div>
            <div class="key">k</div>
            <div class="key">l</div>
        </div>
        <div class="keyboard-row">
            <div class="key enter">Enter</div>
            <div class="key">z</div>
            <div class="key">x</div>
            <div class="key">c</div>
            <div class="key">v</div>
            <div class="key">b</div>
            <div class="key">n</div>
            <div class="key">m</div>
            <div class="key backspace">Backspace</div>
        </div>
    </div>
`
const game = async () => {
    document.querySelector('game-state').innerHTML = initialState;
    const typeSound = new Audio('./typing.wav');
    typeSound.volume = 0.3;
    let timer;
    let clockRunning = false;

    // backend game creation / joining
    const opponentNameDock = document.querySelector(".opponentName");
    let gameData = await getGameData(sessionStorage.getItem('username'));
    document.querySelector('.hours').innerText = 'searching...'
    const opponentGrid = document.querySelector(".opponent").children[0]
    const word = gameData.word;
    const playerIndex = gameData.players.length - 1;
    const playerName = gameData.players[playerIndex].playerName;
    const opponentIndex = gameData.players.length > 1 ? 0 : 1;
    let opponentElo;
    const playerElo = gameData.players[playerIndex].elo;
    const token = gameData.token;
    const prevGuesses = document.querySelector(".prev-guess-bay");
    let potentialWin = false;

    // starting loop to check if match has been found and start the game
    const matchmaker = setInterval(async () => {
        checkReadyStatus(token).then(async isReady => {
            if (isReady == true) {
                document.querySelector('.hours').innerText = 'Match Started!'
                gameData = await startGame({
                    token: token,
                    isRunning: true
                });
                const startSound = new Audio('./start.wav')
                startSound.volume = 0.5;
                startSound.play();
                const enemy = gameData.players[opponentIndex].playerName == 1 ||
                            gameData.players[opponentIndex].playerName == 2 ? `Player ${gameData.players[opponentIndex].playerName}` :
                            gameData.players[opponentIndex].playerName;
                opponentElo = gameData.players[opponentIndex].elo == 400 ? playerElo : gameData.players[opponentIndex].elo;
                opponentNameDock.innerText = `${enemy}: ${opponentElo}`
                
                clearInterval(matchmaker);
            }
            if (isReady == 'timeout') {
                alert('no one is playing please try again later');
                clearInterval(matchmaker);
            }
        })
    }, 1000)
    const updater = setInterval(() => {
        if (gameData.isRunning) {
            if (!clockRunning) {
                let secondsTill = (gameData.killTime - Date.now()) / 1000;
                let soundPlayed = false;
                timer = setInterval(() => {
                    secondsTill--;
                    if (secondsTill < 30 && !soundPlayed) {
                        soundPlayed = true;
                        new Audio('./time_low.wav').play()
                    }
                    if (secondsTill < 1) clearInterval(timer)
                    const seconds = Math.floor(secondsTill % 60).toString().length > 1 ? Math.floor(secondsTill % 60) : '0' + Math.floor(secondsTill % 60).toString()
                    const minutes = Math.floor((secondsTill / 60) % 60).toString().length > 1 ? Math.floor((secondsTill / 60) % 60) : '0' + Math.floor((secondsTill / 60) % 60).toString()
                    document.querySelector('.hours').innerText = `${Math.floor(secondsTill / 3600)}:${minutes}:${seconds}`;
                }, 1000)
                clockRunning = true;
            }
            if (!potentialWin) {
                updateGame(gameData, playerIndex).then(res => res.json()).then(res => {
                    gameData = res;
                    handleState();

                    let statusArray = [0,0,0,0,0];
                    const guess = gameData.players[opponentIndex].lastGuess;
        
                    if (guess) {
                        statusArray = check(word, guess);
                        Array.from(opponentGrid.children).forEach((letter, index) => {
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
        } else if (gameData.killTime) {
            handleState()
        }
    }, 1000)

    const addGuess = (guess, guessBay) => {
        if (guessBay.children.length < 4) {
            guessBay.innerHTML += `
            <div class="letter-grid small-grid">
                <div class="letter-row">
                    <div style="background: ${guess[0].color}" class="letter">
                        ${guess[0].letter}
                    </div>
                    <div style="background: ${guess[1].color}" class="letter">
                        ${guess[1].letter}
                    </div>
                    <div style="background: ${guess[2].color}" class="letter">
                        ${guess[2].letter}
                    </div>
                    <div style="background: ${guess[3].color}" class="letter">
                        ${guess[3].letter}
                    </div>
                    <div style="background: ${guess[4].color}" class="letter">
                        ${guess[4].letter}
                    </div>
                </div>
            </div>`
        } else {
            guessBay.removeChild(guessBay.children[0]);
            guessBay.innerHTML += `
            <div class="letter-grid small-grid">
                <div class="letter-row">
                    <div style="background: ${guess[0].color}" class="letter">
                        ${guess[0].letter}
                    </div>
                    <div style="background: ${guess[1].color}" class="letter">
                        ${guess[1].letter}
                    </div>
                    <div style="background: ${guess[2].color}" class="letter">
                        ${guess[2].letter}
                    </div>
                    <div style="background: ${guess[3].color}" class="letter">
                        ${guess[3].letter}
                    </div>
                    <div style="background: ${guess[4].color}" class="letter">
                        ${guess[4].letter}
                    </div>
                </div>
            </div>`
        }
    }
    const handleKeypress = (e, mobile) => {
        typeSound.currentTime = 0;
        typeSound.play();
        guessGrid.classList.remove("unknown-word");
        if (gameData.isRunning) {
            const char = mobile ? e.innerHTML : e.key;
            if (char === 'Enter' && currentGuess.length === 5) {
                const guess = currentGuess.join('');
                if (!words.includes(guess) && guess !== word) {
                    currentGuess = [];
                    guessGrid.classList.add("unknown-word");
                    Array.from(guessGrid.children).forEach((letter, index) => {
                        letter.classList.add('letter--filled--battle')
                        letter.innerHTML = '&nbsp;';
                    })
                } else {
                    gameData.players[playerIndex].lastGuess = guess;
                    let numberCorrect = 0;
                    let statusArray = check(word, guess)

                    let prevGuessDetails = {
                        1: null,
                        2: null,
                        3: null,
                        4: null,
                        5: null,
                    };

                    Array.from(guessGrid.children).forEach((letter, index) => {
                        letter.innerHTML = currentGuess[index];
                        letter.classList.add('letter--filled--battle');
                        if (statusArray[index] === 2) {
                            prevGuessDetails[index] = {
                                letter: letter.innerText,
                                color: 'var(--green)'
                            }
                            letter.style.background = 'var(--green)';
                            numberCorrect++;
                        };
                        if (statusArray[index] === 1) {
                            prevGuessDetails[index] = {
                                letter: letter.innerText,
                                color: 'var(--yellow)'
                            }
                            letter.style.background = 'var(--yellow)'
                        };
                        if (statusArray[index] === 0) {
                            prevGuessDetails[index] = {
                                letter: letter.innerText,
                                color: 'grey'
                            }
                            letter.style.background = 'grey'
                        };
                        keys.forEach(key => {
                            if (key.innerHTML === currentGuess[index].toLowerCase()) {
                                if (statusArray[index] === 2) key.style.background = 'var(--green)';
                                if (statusArray[index] === 1 && key.style.background !== 'var(--green)') key.style.background = 'var(--yellow)';
                                if (statusArray[index] === 0 && key.style.background !== 'var(--green)' && key.style.background !== 'var(--yellow)') key.style.background = 'grey';
                            }
                        })
                    })
                    if (numberCorrect === 5) {
                        updateGame(gameData, playerIndex).then(res => res.json()).then(res => {
                            potentialWin = true;
                            gameData = res;
                            handleState();
        
                            let statusArray = [0,0,0,0,0];
                            const guess = gameData.players[opponentIndex].lastGuess;
                
                            if (guess) {
                                statusArray = check(word, guess);
                                Array.from(opponentGrid.children).forEach((letter, index) => {
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
                    } else {
                        addGuess(prevGuessDetails, prevGuesses);
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
    const handleState = () => {
        if (gameData.winner) {
            if (gameData.winner.playerName == playerName) {
                const eloChange = parseInt(eloCalc({elo: playerElo, score: 1}, {elo: opponentElo, score: 0}));
                modal.open(`
                <div class='modal-card'>
                    <h2>you won</h2>
                    <h3>Elo Change: ${eloChange}</h3>
                    <div class='bottom-nav'>
                        <h4 class='close'>CLOSE</h4>
                        <h4 class='new-battle'>NEW BATTLE</h4>
                    </div>
                </div>`, game)
            } else {
                const eloChange = parseInt(eloCalc({elo: playerElo, score: 0}, {elo: opponentElo, score: 1}));
                modal.open(`
                <div class='modal-card'>
                    <h2>you lost, the word was: ${word}</h2>
                    <h3>Elo Change: ${eloChange}</h3>
                    <div class='bottom-nav'>
                        <h4 class='close'>CLOSE</h4>
                        <h4 class='new-battle'>NEW BATTLE</h4>
                    </div>
                </div>`, game)
            }
            clearInterval(timer)
            clearInterval(updater)
        } else {
            if (!gameData.isRunning) {
                const eloChange = parseInt(eloCalc({elo: playerElo, score: 0.5}, {elo: opponentElo, score: 0.5}));
                modal.open(`
                <div class='modal-card'>
                    <h2>draw, the word was: ${word}</h2>
                    <h3>Elo Change: ${eloChange}</h3>
                    <div class='bottom-nav'>
                        <h4 class='close'>CLOSE</h4>
                        <h4 class='new-battle'>NEW BATTLE</h4>
                    </div>
                </div>`, game)
                clearInterval(timer)
                clearInterval(updater)
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
modal.open(`<div class='modal-card'>
<h2>TEN-HUT SOLDIER</h2>
${sessionStorage.getItem('username') ? '<h3 class="new-battle soldier">NEW BATTLE</h3>' : '<a href="/">LOGIN</a><h3 class="new-battle soldier">PLAY AS GUEST</h3>'}
<a href="/">GO HOME LIKE A BABY</a>
</div>`, game)