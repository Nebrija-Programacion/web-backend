const object1 = {
  nombre: "Alberto",
  apellidos: "Valero Gomez",
  amigos: ["Pedro", "María", "Jorge"],
  perros: [
    {
      nombre: "Pippin",
      edad: 5,
    },
    {
      nombre: "Arwen",
      edad: 2,
    },
  ],
};

const deepPrint = (obj: any): void => {
  if (["string", "number", "boolean"].includes(typeof obj)) {
    console.log(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((elem) => deepPrint(elem));
  } else if (typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      console.log(key + ":");
      deepPrint(obj[key]);
    });
  }
};

const deepClone = (obj: any): any => {
  if (["string", "number", "boolean"].includes(typeof obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((elem) => deepClone(elem));
  }

  const returnObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((key) => {
    returnObj[key] = obj[key];
  });
  return returnObj;
};

const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true; //same object
  if (typeof obj1 !== typeof obj2) return false; //same type

  //check values
  if (["string", "number", "boolean"].includes(typeof obj1)) {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (obj1[i] !== obj2[i]) return false;
    }
    return true;
  }

  const object1Keys = Object.keys(obj1);
  const object2Keys = Object.keys(obj2);
  if (object1Keys.length !== object2Keys.length) return false;
  let boolResult: boolean = true;
  for (let i = 0; i < object1Keys.length; i++) {
    boolResult =
      boolResult && deepEqual(obj1[object1Keys[i]], obj2[object1Keys[i]]);
  }
  return boolResult;
};

deepPrint(object1);
const object2 = deepClone(object1);
deepPrint(object2);
console.log(deepEqual(object1, object2));
object2["nombre"] = "Pedro";
console.log(deepEqual(object1, object2));
