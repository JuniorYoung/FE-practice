let cates = [
  { id: 'animals', parent: null },
  { id: 'mammals', parent: 'animals' },
  { id: 'cats', parent: 'mammals' },
  { id: 'dogs', parent: 'mammals' },
  { id: 'chihuahua', parent: 'dogs' },
  { id: 'labrador', parent: 'dogs' },
  { id: 'persian', parent: 'cats' },
  { id: 'siamese', parent: 'cats' },
];

/*
{
  animals: {
    mammals: {
      cats: {
        persian: null,
        siamese: null,
      },
      dogs: {
        chihuahua: null,
        labrador: null,
      }
    }
  }
}
*/

/*
// 第一种方法: 
const makeTree = (arr, parent) => {
  const n = {};
  arr
    .filter(c => c.parent === parent)
    .forEach(c => {
      n[c.id] = makeTree(arr, c.id);
    });
  return n;
}
const r = makeTree(cates, null);
*/

const makeTree = (arr, parent) => {
  const a = arr.filter(c => c.parent === parent);
  return a.length === 0
    ? null
    : a
        .reduce((prev, curr) => {
          prev[curr.id] = makeTree(arr, curr.id);
          return prev;
        }, {});
};
const r = makeTree(cates, null);

console.log(JSON.stringify(r, null, 2));
