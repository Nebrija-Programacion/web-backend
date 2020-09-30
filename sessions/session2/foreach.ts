const foreach = (arr: any[], f: Function): void => {
  for (let a of arr) {
    f(a);
  }
};

const array = [1, 2, 3, 4];

foreach(array, (elem: any) => console.log(elem));
