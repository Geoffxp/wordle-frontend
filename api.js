const URL = "http://localhost:5000"
// const URL = "https://six-hour-words.herokuapp.com"

export async function getGordle() {
    const gordle = await fetch(`${URL}/`).then(res => res.json()).then(res => res.data);
    return gordle;
}
export async function getList() {
    const list = await fetch(`${URL}/getList`).then(res => res.json()).then(res => res.data);
    return list;
}

export async function getGameData(playerName) {
    if (playerName) {
        return await fetch(`${URL}/battle?playerName=${playerName}`).then(res => res.json());
    } else {
        return await fetch(`${URL}/battle`).then(res => res.json());
    }
}
export async function checkReadyStatus(token) {
    return await fetch(`${URL}/battle?token=${token}`).then(res => res.json()).then(res => {
        if (res.players.length > 1) {
            return true;
        } else if (res.timeout) {
            return 'timeout'
        }
        return false;
    })
}
export async function startGame(data) {
    return await fetch(`${URL}/battle?token=${data.token}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
}
export async function updateGame(data, playerIndex) {
    return await fetch(`${URL}/battle?player=${playerIndex}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function attemptLogin(data) {
    if (data.signup) {
        return await fetch(`${URL}/user/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    } else {
        return await fetch(`${URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }
}








// export async function updateGame() {
//     let current = 0;
//     const gameAlive = setInterval(() => {
//         current++
//         if (current > 1) clearInterval(gameAlive)
//         fetch('${URL}battle', {
//             method:"POST",
//             headers: {
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({currentGuesses: localStorage.getItem('guesses')})
//         }).then(res=>res.json()).then(console.log)
//     }, 5000)
// }