import { copyText } from "./clipboard.js";

export default class Modal {
    constructor(mount) {
        this.mount = document.querySelector(mount);
        this.mount.addEventListener('click', (e) => {
            const card = document.querySelector('.modal-card')
            const share = document.querySelector('.modal-card p')
            if (e.target.contains(this.mount)) {
                this.close()
            }   
            share.addEventListener('click', copyText)   
        });

    }
    open(content) {
        this.mount.innerHTML = content;
        this.mount.classList.add('open');
    }
    close() {
        this.mount.innerHTML = '';
        this.mount.classList.remove('open')
    }
}