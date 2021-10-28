const map = (arr: any[], f: Function): any[] => {
  const result: any[] = [];
  for (let a of arr) {
    result.push(f(a));
  }
  return result;
};

const array = [1, 2, 3, 4];

const mappedArray = map(array, (elem: any) => 2 * elem); // -> [2,4,6,8]
