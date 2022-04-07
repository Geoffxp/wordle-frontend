export async function getWord() {
    const word = await fetch("https://six-hour-words.herokuapp.com/").then(res => res.json()).then(res => res.data);
    return word;
}
export async function getList() {
    const list = await fetch("https://six-hour-words.herokuapp.com/getList").then(res => res.json()).then(res => res.data);
    return list;
}