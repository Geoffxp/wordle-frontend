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
        share.addEventListener('click', copyText);
    }
    close() {
        this.mount.innerHTML = '';
        this.mount.classList.remove('open')
    }
}