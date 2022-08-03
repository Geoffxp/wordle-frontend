import { getUserDetails } from "./api.js"

const username = sessionStorage.getItem('username')
const { elo, wins, losses, ties, games } = await getUserDetails(username)
const lastGame = games.length ? JSON.parse(games[games.length - 1]) : {}
document.querySelector("account").innerHTML = `
    <h1>${username}</h1>
    <h2>ELO: ${elo}</h2>
    <h2>WINS: ${wins}</h2>
    <h2>LOSSES: ${losses}</h2>
    <h2>TIES: ${ties}</h2>
    <h2>LAST GAME:</h2>
    <ul>
        <li>WORD: ${lastGame.word}</li>
        <li>PLAYER 1: ${lastGame.players[0].playerName}</li>
        <li>PLAYER 2: ${lastGame.players[1].playerName}</li>
        <li>WINNER: ${lastGame.winner.playerName}</li>
    </ul
`