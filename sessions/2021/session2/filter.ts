const filter = (arr: any[], f: Function): any[] => {
  const result: any[] = [];
  for (let a of arr) {
    if (f(a)) result.push(a);
  }
  return result;
};

const array = [1, 2, 3, 4];

const filteredArray = filter(array, (elem: any) => elem % 2 === 0); // -> [2,4]
