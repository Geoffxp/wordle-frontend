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
    open(content, game) {
        this.mount.innerHTML = content;
        this.mount.classList.add('open');
        const share = document.querySelector('.modal-card p');
        const close = document.querySelector('.modal-card .close');
        const newBattles = document.querySelectorAll('.modal-card .new-battle');
        newBattles.forEach(newBattle => {
            newBattle.addEventListener('click', () => {
                game();
                this.close();
            })
        })
        if (close) close.addEventListener('click', () => this.close());
        if (share) share.addEventListener('click', copyText);
    }
    close() {
        this.mount.innerHTML = '';
        this.mount.classList.remove('open')
    }
}