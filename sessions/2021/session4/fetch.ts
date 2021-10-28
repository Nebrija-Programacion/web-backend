const url = Deno.args[0] || "https://rickandmortyapi.com/api/character/1";
console.log(url);
const res2 = await fetch(url);
const data = await res2.json();
console.log(data);
