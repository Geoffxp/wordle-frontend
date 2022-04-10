export async function getGordle() {
    const gordle = await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
    return gordle;
}
export async function getList() {
    const list = await fetch("https://six-hour-words.herokuapp.com/getList").then(res => res.json()).then(res => res.data);
    return list;
}

export async function getGameData() {
    return await fetch("https://six-hour-words.herokuapp.com/battle").then(res => res.json());
}
export async function checkReadyStatus(token) {
    return await fetch(`https://six-hour-words.herokuapp.com/battle?token=${token}`).then(res => res.json()).then(res => {
        if (res.players.length > 1) {
            return true;
        } else if (res.timeout) {
            return 'timeout'
        }
        return false;
    })
}
export async function startGame(data) {
    return await fetch(`https://six-hour-words.herokuapp.com/battle?token=${data.token}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
}
export async function updateGame(data, playerIndex) {
    return await fetch(`https://six-hour-words.herokuapp.com/battle?player=${playerIndex}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}








// export async function updateGame() {
//     let current = 0;
//     const gameAlive = setInterval(() => {
//         current++
//         if (current > 1) clearInterval(gameAlive)
//         fetch('https://six-hour-words.herokuapp.com/battle', {
//             method:"POST",
//             headers: {
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({currentGuesses: localStorage.getItem('guesses')})
//         }).then(res=>res.json()).then(console.log)
//     }, 5000)
// }