import { copyText } from "./clipboard.js";

export default class Modal {
    constructor(mount) {
        this.mount = document.querySelector(mount);
        this.mount.addEventListener('click', (e) => {
            if (e.target.contains(this.mount)) {
                this.close()
            }
        });

    }
    open(content) {
        this.mount.innerHTML = content;
        this.mount.classList.add('open');
        const share = document.querySelector('.modal-card p');
        const close = document.querySelector('.modal-card .close');
        const newBattle = document.querySelector('.modal-card .new-battle');
        if (newBattle) newBattle.addEventListener('click', () => window.location.reload());
        if (close) close.addEventListener('click', () => this.close());
        if (share) share.addEventListener('click', copyText);
    }
    close() {
        this.mount.innerHTML = '';
        this.mount.classList.remove('open')
    }
}