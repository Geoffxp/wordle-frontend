export async function getWord() {
    return await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
}
export async function getList() {
    return await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
}