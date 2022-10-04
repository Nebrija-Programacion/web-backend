/*****************************************************************
Completar la función object2string para que la igualdad final sea true
const obj = {
    name: "Alberto",
    age: 22,
    friends: ["Luis", "María", "Jose"],
    parents: [
        {key: "padre", value: "Luis"},
        {key: "madre", value: "Lola"}
    ]
}

const object2String = (obj: unknown):string => {
   let str = "";
   // .....
   return str;
}

object2String(obj) === JSON.stringify(obj);
*****************************************************************/

const obj = {
  name: "Alberto",
  age: 22,
  friends: ["Luis", "María", "Jose"],
  parents: [
    { key: "padre", value: "Luis" },
    { key: "madre", value: "Lola" },
  ],
};

const object2string = (obj: unknown): string => {
  if (typeof obj === "string") return `"${obj}"`;
  if (typeof obj === "number") return `${obj}`;
  if (typeof obj === "boolean") return `${obj}`;
  if (obj === null) return "null";
  if (Array.isArray(obj)) return `[${obj.map(object2string).join(",")}]`;
  if (typeof obj === "object") {
    const ret = Object.keys(obj).reduce((acc, key) => {
      return `${acc}"${key}":${object2string(obj[key])},`;
    }, "{");
    return `${ret.slice(0, -1)}}`;
  }
  return "";
};

console.log(object2string(obj));
console.log(JSON.stringify(obj));

// check if it works
console.log(object2string(obj) === JSON.stringify(obj));
