const chat = async () => {
    const messages = [];
    const sendBtn = document.querySelector(".send");
    const textarea = document.querySelector(".message");
    const feed = document.querySelector(".feed");

    feed.scrollTo(0, feed.scrollHeight);

    const join = await fetch("https://six-hour-words.herokuapp.com/chat", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: 'Goff'
        })
    }).then(res => res.json());
    join.messages.forEach(message => {
        messages.push(message)
        const newMessage = document.createElement('p');
        newMessage.innerText = message;
        feed.appendChild(newMessage)
    })
    const keepAlive = setInterval(() => {
        return fetch("https://six-hour-words.herokuapp.com/chat").then(res => res.json()).then(res => {
            res.messages.forEach(message => {
                if (!messages.includes(message)) {
                    const newMessage = document.createElement('p');
                    newMessage.innerText = message;
                    feed.appendChild(newMessage)
                    messages.push(message)
                }
            })
        })
    }, 1000)
    const post = async (message) => {
        return fetch("https://six-hour-words.herokuapp.com/chat", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        }).then(res => res.json()).then(res => {
            res.messages.forEach(message => {
                if (!messages.includes(message)) {
                    const newMessage = document.createElement('p');
                    newMessage.innerText = message;
                    feed.appendChild(newMessage)
                    messages.push(message)
                }
            })
        })
    }
    sendBtn.addEventListener('click', () => {
        post(textarea.value).then(res => {
            textarea.value = ''
        });
    })
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            sendBtn.click();
        }
    })
}
chat(); 

// const lobby = async () => {
//     let close = false
//     const createLobby = await fetch("https://six-hour-words.herokuapp.com/battle")
//     .then(res => res.json())
//     .then(res =>res.data)
    
//     let message = ''
    
//     if (createLobby.game) {
//         console.log('keep alive')
//         const liveLobby = setInterval(() => {
//             if (close) clearInterval(liveLobby)
//             fetch('https://six-hour-words.herokuapp.com/battle', {
//                 method:"POST",
//                 headers: {
//                     'Content-Type':'application/json'
//                 },
//                 body: JSON.stringify({
//                     token: createLobby.token,
//                 })
//             }).then(res=>res.json()).then(console.log)
//         }, 5000)
//         const getMessages = setInterval(() => {
//             if (close) clearInterval(liveLobby)
//             fetch('https://six-hour-words.herokuapp.com/battle', {
//                 method:"POST",
//                 headers: {
//                     'Content-Type':'application/json'
//                 },
//                 body: JSON.stringify({
//                     token: createLobby.token,
//                 })
//             }).then(res=>res.json()).then(console.log)
//         }, 5000)
//     }
//     document.querySelector(".send").addEventListener("click", () => {
//         const textarea = document.querySelector(".message");
//         const feed = document.querySelector(".feed");
//         const text = textarea.value;
//         fetch('https://six-hour-words.herokuapp.com/battle', {
//             method:"POST",
//             headers: {
//                 'Content-Type':'application/json'
//             },
//             body: JSON.stringify({
//                 message: text,
//             })
//         }).then(res=>res.json()).then(console.log)
//         textarea.value = '';
//     })
// }
// lobby()