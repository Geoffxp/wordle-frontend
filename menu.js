import { attemptLogin } from "./api.js";

const checker = /^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
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
        account.style.display = 'block';
    } else {
        login.style.display = 'block';
        account.style.display = 'none';
    }
}

logout.addEventListener("click", () => {
    sessionStorage.removeItem('username')
    window.location.reload();
})

signupBtn.addEventListener("click", () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (checker.test(username)) {
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
    if (checker.test(username)) {
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
