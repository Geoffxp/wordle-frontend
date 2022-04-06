export async function getWord() {
    return await fetch("http://localhost:5000/").then(res => res.json()).then(res => res.data);
}
export async function getList() {
    return await fetch("http://localhost:5000/getList").then(res => res.json()).then(res => res.data);
}