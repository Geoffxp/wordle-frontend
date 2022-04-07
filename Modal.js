export default class Modal {
    constructor(mount) {
        this.mount = document.querySelector(mount);
        this.mount.addEventListener('click', () => this.close());
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