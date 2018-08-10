// JavaScript的第七种数据类型: Symbol

//基本用法
{
    //通过Symbol()函数生成值
    let sym = Symbol();
    console.log(typeof sym); // symbol

    //函数使用参数 表示对Symbol类型值的描述 便于跟其他Symbol类型值区分开
    let symPa = Symbol('foo');
    console.log(symPa); // Symbol(foo)
    console.log(symPa.toString()); // Symbol(foo)

    //Symbol值可以转为 字符串和布尔值 但不能转为数值
    console.log(String(symPa)); // Symbol(foo)
    console.log(Boolean(symPa)); // true
}

//对象的属性名除了可以是字符串 还可以是Symbol类型
{
    let sym1 = Symbol('name');
    let sym2 = Symbol('age');

    //第一种写法
    let obj1 = {};
    obj1[sym1] = 'Junior';
    obj1[sym2] = 100;
    console.log(obj1); // {Symbol(name): "Junior", Symbol(age): 100}
    //第二种写法
    let obj2 = {
        [sym1]: 'Junior',
        [sym2]: 100
    };
    console.log(obj2); // {Symbol(name): "Junior", Symbol(age): 100}
    //第三种写法
    let obj3 = {};
    Object.defineProperties(obj3, {
        [sym1]: {
            value: 'Junior'
        },
        [sym2]: {
            value: 100
        }
    });
    console.log(obj3); // {Symbol(name): "Junior", Symbol(age): 100}
}
//Symbol类型用于定义一组常量
{
    const logLevel = {
        DEBUG: Symbol('debug'),
        INFO: Symbol('info'),
        WARNING: Symbol('warning'),
        ERROR: Symbol('error')
    }
    console.log(logLevel.DEBUG);
}
//消除“魔术”字符串
{
    // 魔术字符串是与代码强耦合的某一个具体字符串
    function f1(color) {
        switch(color) {
            case 'red':
                // more code
                break;
            case 'green':
                // more code
                break;
        }
    }
    // f1('color');

    // 可以通过常量优化
    const COLORS1 = {
        red: 'red',
        green: 'green'
    };
    function f2(color) {
        switch(color) {
            case COLORS1.red:
                break;
            case COLORS1.green:
                break;
        }
    }
    // f2(COLORS1.red);

    //由于使用时常量是哪个具体值（如 'red'、'green'）并不重要，目的只是标识不同的类型。
    //所以可以用Symbol()类型值再进行优化
    const COLORS2 = {
        red: Symbol('red'),
        green: Symbol('green')
    };
    function f3(color) {
        switch(color) {
            case COLORS2.red:
                break;
            case COLORS2.green:
                break;
        }
    }
    // f3(COLORS2.red)
}
// Object.getOwnPropertySymbols(object) 返回指定对象的所有Symbol类型属性名
{
    let sym1 = Symbol('name');
    let sym2 = Symbol('age');

    let obj1 = {};
    obj1[sym1] = 'Junior';
    obj1[sym2] = 100;

    console.log(Object.getOwnPropertySymbols(obj1)); // [Symbol(name), Symbol(age)]

    // Reflect.ownKeys() 返回所有类型的键名 包括字符串键名和Symbol类型的键名
    obj1.addr = '地球村大中华区';
    console.log(Reflect.ownKeys(obj1)); // ["addr", Symbol(name), Symbol(age)]
}
// Symbol.for()  Symbol.keyFor()
{
    // Symbol.for() 搜索有没有以该指定的参数作为名称的Symbol值 如果有则返回该Symbol值 否则就创建并返回一个以该参数为名称的Symbol值

    let s1 = Symbol.for('foo'); // 创建一个新的Symbol值
    let s2 = Symbol.for('foo'); // 先搜索 有则返回
    console.log(s1 === s2); // true

    // 与Symbol()的区别。以Symbol()创建的值不会被搜索到
    let s3 = Symbol('baz'); // 创建新值
    let s4 = Symbol.for('baz'); // 先搜索 无则创建新值
    console.log(s3 === s4); // false

    // Symbol.keyFor() 返回一个以Symbol.for()创建的值的key
    console.log(Symbol.keyFor(s3)); // undefined
    console.log(Symbol.keyFor(s4)); // baz
}
// 内置的Symbol值
{
    // 除了可以自定义Symbol值以外，ES6还内置了 11 个Symbol值，指向语言内部使用的方法

    // Symbol.hasInstance 判断一个对象是否是某个类型的实例（foo instanceof Foo）时，实际调用的是Foo[Symbol.hasInstance](foo)
    {
        const Even = {
            [Symbol.hasInstance](obj) {
                return obj % 2 === 0;
            }
        };
        //等同于
        // class Even {
        //     static [Symbol.hasInstance](obj) {
        //         return obj % 2 === 0;
        //     }
        // }

        console.log(1 instanceof Even); // false
        console.log(2 instanceof Even); // true
    }
    // Symbol.isConcatSpreadable
    // Symbol.species
    // Symbol.match
    // Symbol.replace
    // Symbol.search
    // Symbol.split
    // Symbol.iterator
    // Symbol.toPrimitive
    // Symbol.toStringTag
    // Symbol.unscopables
}