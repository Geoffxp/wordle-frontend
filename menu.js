import { attemptLogin } from "./api.js";

// const checker = /^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
const validchars = 'abcdefghijklmnopqrstuvwxzy1234567890'
const checker = (input) => {
    if (input.length === 0 || input.length > 20) {
        return false;
    }
    for (let i = 0; i < input.length; i++) {
        if (!validchars.includes(input[i])) return; false
    }
    return true;
}
const logout = document.querySelector(".logout");

const burger = document.querySelector(".hamburger");
const menu = document.querySelector(".gordle ul");
const login = document.querySelector(".login");
const account = document.querySelector(".account");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

burger.addEventListener('click', () => {
    console.log('hi')
    burger.parentNode.classList.toggle("open")
})
window.onload = () => {
    const user = sessionStorage.getItem('username')
    if (user) {
        login.style.display = 'none';
        logout.style.display = 'block';
        account.style.display = 'block';
    } else {
        login.style.display = 'block';
        logout.style.display = 'none';
        account.style.display = 'none';
    }
}

logout.addEventListener("click", () => {
    sessionStorage.removeItem('username')
    window.location.reload();
})

signupBtn.addEventListener("click", () => {
    const username = usernameInput.value.toLowerCase();
    const password = passwordInput.value;

    if (checker(username)) {
        attemptLogin({
            signup: true,
            username: username,
            password: password
        }).then(res => res.json()).then(res => {
            if (res.userCreated) {
                sessionStorage.setItem('username', username);
                window.location.reload()
            } else {
                alert("Username is already taken")
            }
        })
    } else {
        alert("invalid username");
    }
})
loginBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (checker(username)) {
        attemptLogin({
            signup: false,
            username: username,
            password: password
        }).then(res => res.json()).then(res => {
            if (res.username) {
                sessionStorage.setItem('username', username);
                alert(`Welcome ${username}`)
                window.location.reload()
            } else {
                alert("We dont know you.")
            }
        })
    } else {
        alert("invalid username")
    }
})
