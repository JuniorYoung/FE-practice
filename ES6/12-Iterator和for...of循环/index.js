// 模拟迭代器的next()
{
    // 生成一个包含next()的指针对象
    let makeIterator = (arr) => {
        let nextIndex = 0;
        return {
            next: function() {
                return nextIndex < arr.length
                ? { value: arr[nextIndex++], done: false }
                : { value: undefined, done: true };
            }
        };
    };
}
// 一个数据结构只要具有 [Symbol.iterator] 属性，则该数据结构就是可迭代的
// 数组、Set、Map、String、TypedArray、NodeList、函数的arguments内置该属性，默认可迭代
// Object不内置，可以定义[Symbol.iterator]属性，该属性值是一个生成迭代器的函数(Generator函数和普通函数都可以，规定该函数返回一个遵守迭代器协议的对象)
{
    const obj = {};
    obj[Symbol.iterator] = function* () {
        yield 1;
        yield 2;
        yield 3;
    };
    for(let i of obj) {
        console.log(i);
    }
    // 1
    // 2
    // 3

    const CustomObj = function(value) {
        this.value = value;
        this.next = null;
    };
    // 实现Iterator接口，返回自定义的迭代器
    CustomObj.prototype[Symbol.iterator] = function() {
        var current = this;
        var ite = { next: next };
        function next() {
            if(current) {
                const value = current.value;
                current = current.next;
                return {
                    done: false,
                    value: value
                };
            } else {
                return { done: true };
            }
        }
        return ite;
    };
    const co1 = new CustomObj(1);
    const co2 = new CustomObj(2);
    const co3 = new CustomObj(3);

    co1.next = co2;
    co2.next = co3;

    for(let coi of co1) {
        console.log(coi);
    }
    // 1
    // 2
    // 3
}

// 默认调用Iterator接口的场景
{
    // 1.解构赋值

    // 2.扩展运算符

    // 3.yield* 表达式

    // 4.任何使用数组作为参数的场景，如 Array.from()、Promise.all()、Promise.race() 等
}

// Iterator接口与Generator函数
{
    // Generator函数自动返回迭代器对象
    let myObj1 = {
        [Symbol.iterator]: function* () {
            yield 1;
            yield 2;
            yield 3;
        }
    };

    //等同于
    let myObj2 = {
        * [Symbol.iterator]() {
            yield 1;
            yield 2;
            yield 3;
        }
    };
}

// for...of循环
{
    // for...of 可用来遍历具有Iterator接口的数据结构


    // 1.数组
    {
        const arr = ['red', 'green', 'blue'];
        arr.prop1 = 'p1';
        for(let v of arr) {
            console.log(v);
        }
        // red
        // green
        // blue

        /**
         * 与for...in 的区别（以遍历数组为例）
         * 1. for...in 遍历数组时，返回成员的索引和手动添加的属性，也包括原型链上的属性（可枚举）
         * 2. 某些情况下，for...in会以任意顺序遍历
         */
        for(let i in arr) {
            console.log(i);
        }
        // 0
        // 1
        // 2
        // prop1
    }

    // 2.Set、Map结构

    // 3.对象

    // 4.类似数组的对象

    // 5.
}