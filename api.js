export async function getGordle() {
    const gordle = await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
    return gordle;
}

export async function getWord() {
    const word = await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
    return word;
}
export async function getList() {
    const list = await fetch("https://six-hour-words.herokuapp.com/getList").then(res => res.json()).then(res => res.data);
    return list;
}

export async function updateGame() {
    let current = 0;
    const gameAlive = setInterval(() => {
        current++
        if (current > 1) clearInterval(gameAlive)
        fetch('http://localhost:5000/battle', {
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({currentGuesses: localStorage.getItem('guesses')})
        }).then(res=>res.json()).then(console.log)
    }, 5000)
}