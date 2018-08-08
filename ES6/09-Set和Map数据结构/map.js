// Object本质是键值对的集合，但对象的属性（键名）只能是字符串
// Map类似于对象，也是键值对的集合，但它的键名可以是任意类型的值

//基本用法
{
    const m1 = new Map();
    const obj1 = {name: 'junior'};
    m1.set(obj1, 'this is a object'); // set() 返回Map对象自身
    console.log(m1.get(obj1)); // this is a object
    console.log(m1.has(obj1)); // true
    console.log(m1.delete(obj1)); // true

    //使用构造函数初始化
    //任何实现了Iterable接口且每个成员都是一个双元素的数组的数据结构都可作为构造函数的参数 如 Set对象
    const m2 = new Map([
        [obj1, 'this is a object'],
        ['age', 30]
    ]);
    console.log(m2.has(obj1)); // true

    //Map对象的键名是个引用类型的值时，若两个引用类型指向的数据结构一模一样，在Map结构中表示的是两个键值对
    const k1 = ['a'];
    const k2 = ['a'];
    m2
      .set(k1, 'k1')
      .set(k2, 'k2');
    console.log(m2.get(k1)); // k1
    console.log(m2.get(k2)); // k2

    //Map的键名根据 严格相等运算符 比较是否相等 ，如 true 和 'true' 代表不同的键名
    
}
//Map实例的属性和方法
{
    //size

    //操作方法
    {
        //set(key, value)

        //get(key) 如果找不到key 返回undefined
    
        //has(key)

        //delete(key)

        //clear() 清空所有成员 void
    }

    //遍历方法
    {
        const obj1 = { name: 'Junior' };
        const arr1 = ['a', 'b', 'c'];
        const m1 = new Map([
            ['a', 'a string'],
            [obj1, 'a object'],
            [arr1, 'a array']
        ]);
        //keys() 返回包含所有键名的迭代器
        for(let key of m1.keys()) {
            console.log(key);
        }
        //values() 返回包含所有键值的迭代器
        for(let value of m1.values()) {
            console.log(value);
        }
        //entries() 返回包含所有成员的迭代器
        for(let [key, value] of m1.entries()) { // 等同于 let [key, value] of m1
            console.log(key, value);
        }
        //forEach() 遍历所有成员 第二个参数可绑定回调函数的this(非箭头函数)
        m1.forEach(function(value, key, thisMap) {
            console.log(key === this ? value : 'not match');
        }, obj1);
        // not match
        // a object
        // not match
    }
    //通过把Map对象转换成数组，可间接使用数组的map()、filter() 可实现遍历和过滤Map成员
    {
        const m1 = new Map()
          .set(1, 'a')
          .set(2, 'b')
          .set(3, 'c');
        const mapToArray = [...m1];
        // or const mapToArray = Array.from(m1);
    }
}
//与其他数据结构的相互转换
{
    // Map -> Array

    // Array -> Map

    // Map -> Object
    let mapToObject = (map) => {
        let obj = Object.create(null);
        for(let [key, value] of map) {
            obj[key] = value;
        }
        return obj;
    };
    // Object -> Map
    let objectToMap = (obj) => {
        let map = new Map();
        for(let k of Object.keys(obj)) {
            map.set(k, obj[k]);
        }
        return map;
    }
    // Map -> JSON
    // 1> Map所有成员的key都是字符串，可转为对象JSON  如： JSON.stringify(mapToObject(map));
    // 2> Map某些成员的key非字符串，可转为数组JSON    如： JSON.stringify([...map]);

    // JSON -> Map 以上的逆操作
    // 1> 键值对格式的JSON
    // 2> 数组格式的JSON，要求数组的每个成员都是双元素的数组
}