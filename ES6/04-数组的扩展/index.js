//扩展运算符
{
    const arr = [1, 2, 3];
    console.log(...arr); // 1 2 3
    //主要应用于函数调用
    {
        function add(x, y) {
            console.log(x + y);
        }
        add(...[2, 4]); // 6
        function push(arr, ...items) {
            arr.push(...items);
            console.log(arr);
        }
        push([], 2, 3, 4, 5, 6); // [2, 3, 4, 5, 6]
        function f(v, w, x, y, z) {
            console.log(v, w, x, y, z);
        }
        const arr = [0, 1];
        f(-1, ...arr, 2, ...[3]); // -1 0 1 2 3
    }
    //替代apply方法
    {
        const arr = [0, 1, 2];
        //ES5
        function a(x, y, z) {
            console.log(x, y, z);
        }
        a.apply(null, arr); // 0 1 2
        //ES6
        a(...arr); // 0 1 2
        
        //求数组元素的最大值
        const nums = [2, 3, 1, 0, 99, 288, 23, 45, 32];
        //ES5
        console.log(Math.max.apply(null, nums)); // 288
        //ES6
        console.log(Math.max(...nums)); // 288

        //把一个数组添加到另一个数组的尾部
        let arr1 = [0, 1, 2];
        const arr2 = [3, 4, 5];
        //ES5
        Array.prototype.push.apply(arr1, arr2);
        //ES6
        //arr1.push(...arr2);
    }
    //复制数组
    {
        const a1 = [1, 2, 3];
        
        //ES5
        const a2 = a1.concat();
        a2[0] = 0;
        console.log(a1); // [1, 2, 3]

        //ES6
        const a3 = [...a1];
        //or
        const [...a4] = a1;
        console.log(a3); // [1, 2, 3]
        console.log(a4); // [1, 2, 3]
    }
    //合并数组
    {
        const arr1 = ['a', 'b'];
        const arr2 = ['c'];
        const arr3 = ['d', 'e'];
        //ES5
        const newArrES5 = arr1.concat(arr2, arr3);
        console.log(newArrES5); // ['a', 'b', 'c', 'd', 'e']
        //ES6
        const newArrES6 = [...arr1, ...arr2, ...arr3];
        console.log(newArrES6); // ['a', 'b', 'c', 'd', 'e']
    }
    //与解构赋值结合使用
    {
        const list = ['a', '1', '2', '3', '4'];
        //ES5
        const es5_a = list[0];
        const es5_rest = list.slice(1);
        console.log(es5_a, es5_rest); // a ['1','2','3','4']
        //ES6
        const [es6_a, ...es6_rest] = list;
        console.log(es6_a, es6_rest); // a ['1','2','3','4']
    }
    //把字符串分解为数组
    {
        const str = 'hello';
        console.log(...str); // h e l l o
    }
    //任何实现了Iterator接口的对象，都可以用扩展运算符转为真正的数组
    {
        // Map
        let map = new Map([
            [1, 'one'],
            [2, 'two'],
            [3, 'three']
        ]);
        let arrMap = [...map.keys()];
        console.log(arrMap); // [1, 2, 3]
        // Generator函数
        const gene = function*() {
            yield 1;
            yield 2;
            yield 3;
        };
        console.log(...gene()); // 1 2 3
    }
}
//Array.from()
{
    //将以下两类对象转换为Array对象

    //类似数组的对象 array-like object
    {
        let arrayLike = {
            '0': 'zero',
            '1': 'one',
            '2': 'two',
            length: 3
        };
        //ES5
        const es5_arr = [].slice.call(arrayLike);
        console.log(es5_arr); // ['zero', 'one', 'two']
        //ES6
        const es6_arr = Array.from(arrayLike);
        console.log(es6_arr); // ['zero', 'one', 'two']
    }
    //可遍历的对象 Set Map
    {
        const set = new Set(['a', 'b']);
        console.log(Array.from(set)); // ['a', 'b']
    }
    //Array.from的第二个参数 作用类似于数组的map方法
    {
        const set = new Set(['a', 'b', 'c']);
        console.log(Array.from(set, x => x + '_append')); // ["a_append", "b_append", "c_append"]
        //等同于 Array.from(set).map(x => x + '_append');
        
        //将数组中布尔值为false的成员转为0
        console.log(Array.from([1, ,2, ,3 ], x => x || 0)); // [1, 0, 2, 0, 3]
    }
}
//Array.of()
{
    //将一组值转换为数组
    console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]
    //等同于
    function ArrayOf() {
        return [].slice.call(arguments);
    }
}
//数组实例的 copyWithin()
{
    const arr = [1, 2, 3, 4];
    arr.copyWithin(0, 2);
    console.log(arr); // [3, 4, 3, 4]
}
//数组实例的 find()  findIndex()
{
    //find
    const arr = [1, 2, 3, 0, -1, 30];
    console.log(arr.find( x => x < 0)); // -1
    //findIndex
    console.log(arr.findIndex( x => x < 0)); // 4

    //两个方法都可以接受第二个参数 用于绑定回调函数中的this
    const person = {
        age: 12
    };
    function cb(v) {
        return v > this.age;
    }
    console.log(arr.find(cb, person)); // 30
}
//数组实例的 fill()
{
    console.log(new Array(3).fill(1)); // [1, 1, 1]
    
    //指定第二、第三个参数
    console.log(['a', 'b', 'c', 'd'].fill('b_fill', 1, 2)); // ['a' ,'b_fill', 'c', 'd']
}
//数组实例的 entires()  keys()  values()
{
    //三个方法都返回一个 Iterator 对象 可以用 for...of遍历
    let arr = ['junior', 'mary', 'jak', 'blue'];
    
    console.log('keys(): ');
    for(let index of arr.keys()) {
        console.log(index);
    }
    // 0
    // 1
    // 2
    // 3
    
}
//数组实例的 includes()
{
    const arr = [1, 2, 3, 4];
    console.log(arr.includes(3)); //true

    console.log(arr.includes(2, 2)); // false 从第三个数开始搜索

    // 等同于使用 indexOf() 但是 indexOf() 不够语义化，并且 indexOf内部使用 严格相等运算符进行判断 会导致 NaN 的误判
    console.log([NaN].indexOf(NaN)); // -1
    console.log([NaN].includes(NaN)); // true

    //用来检查当前环境是否支持 includes 不支持则使用一个替代版本
    const contains = (() =>
        Array.prototype.includes
            ? (arr, value) => arr.includes(value)
            : (arr, value) => arr.some(x => x === value)
    )();
}
//数组实例的 flat()  flatMap()
{
}
//数组的空位
{
}