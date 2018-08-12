//基本用法
{
    console.log('>>>>>>>>>>> 1');
    function* helloWorldGenerator() {
        yield 'hello';
        yield 'world';
        return 'ending';
    }
    var hw = helloWorldGenerator();

    console.log(hw.next()); // {value: "hello", done: false}
    console.log(hw.next()); // {value: "world", done: false}
    console.log(hw.next()); // {value: "ending", done: true}
    console.log(hw.next()); // {value: undefined, done: true}

    //ES6没有规定 Generator函数星号的位置 以下都是合法的定义：
    function* f1() { }
    function* f2() { } // 最常用
    function* f3() { }
    function* f4() { }
}
// yield
{
    console.log('>>>>>>>>>>> 2');

    const arr = [1, [[2, 3], 4], [5]];
    let flat = function* (a, index = '无') {
        console.log(`start Generator: 递归索引: ${index}`);
        const length = a.length;
        for (let i = 0; i < length; i++) {
            console.log(`索引值: ${i}`);
            const item = a[i];
            if (typeof item !== 'number') {
                yield* flat(item, i);
            } else {
                yield item;
            }
        }
        console.log(`end Generator: 递归索引: ${index}`);
    };
    let co = 1;
    for (let f of flat(arr)) {
        console.log(`第${co++}次:`);
        console.log(f);
    }
    // let ite = flat(arr);
    // console.log(ite.next().value);
    // console.log('---------');
    // console.log(ite.next().value);
    
    // start Generator: 递归索引: 无
    // 索引值: 0
    // 第1次:
    // 1
    // 索引值: 1
    // start Generator: 递归索引: 1
    // 索引值: 0
    // start Generator: 递归索引: 0
    // 索引值: 0
    // 第2次:
    // 2
    // 索引值: 1
    // 第3次:
    // 3
    // end Generator: 递归索引: 0
    // 索引值: 1
    // 第4次:
    // 4
    // end Generator: 递归索引: 1
    // 索引值: 2
    // start Generator: 递归索引: 2
    // 索引值: 0
    // 第5次:
    // 5
    // end Generator: 递归索引: 2
    // end Generator: 递归索引: 无

    /**
     * 1. yield表达式被包含在另一个表达式中，必须放在圆括号里面
     * 2. yield表达式用作函数参数或放在赋值语句的右边，可以不加圆括号 
     */
}
//与Iterator接口的关系
{
    console.log('>>>>>>>>>>> 3');
}
// next()
{
    console.log('>>>>>>>>>>> 4');
    /**
     * yield表达式本身没有返回值（or 返回undefined）
     * 但是 next() 可以传递一个参数，该参数表示上一个yield表达式的返回值
     */
    let f = function* () {
        for (let i = 0; true; i++) {
            const reset = yield i;
            if (reset) {
                i = -1;
            }
        }
    };
    const gene = f();
    console.log(gene.next()); // {value: 0, done: false}
    console.log(gene.next()); // {value: 1, done: false}
    // 传递参数值 true，表示第二次 next()返回该值
    console.log(gene.next(true)); // {value: 0, done: false}

    //另一个例子
    function* foo(x) {
        const y = 2 * (yield (x + 1));
        const z = yield (y / 3);
        return (x + y + z);
    }
    const g1 = foo(5);
    console.log(g1.next()); // {value: 6, done: false}
    //第二次next()，由于上一次无返回值(或返回值为undefined)，所以 y = 2 * undefined（即NaN）
    console.log(g1.next()); // {value: NaN, done: false}
    //第三次next()，由于上一次无返回值(或返回值为undefined)，所以 return (5 + NaN + undefined) 即NaN
    console.log(g1.next()); // {value: NaN, done: true}

    const g2 = foo(5);
    console.log(g2.next()); // {value: 6, done: false}
    console.log(g2.next(12)); // {value: 8, done: false}
    console.log(g2.next(13)); // {value: 42, done: true}

    //正常情况下，遍历器对象第一次调用next()时无法传入参数
    //如果想要第一次调用next()就能够往Generator函数中传入值，可以再Generator函数外面包一层
    let wrapper = function (generatorFunction) {
        return function (...args) {
            let generatorObject = generatorFunction(...args);
            generatorObject.next();
            return generatorObject;
        }
    };
    const wrapped = wrapper(function* () {
        console.log(`First input: ${yield}`);
        return 'DONE';
    });
    console.log(wrapped().next('hello!'));
    // First input: hello!
    // {value: 'DONE', done: true}
}
// for...of循环
{
    console.log('>>>>>>>>>>> 5');
    // for...of可自动遍历Generator函数返回的Iterator对象，可替代 next()
    {
        let f = function* () {
            yield 1;
            yield 2;
            yield 3;
            return 4;
        };
        for (let i of f()) {
            console.log(i);
        }
        // 1
        // 2
        // 3
    }
    // 斐波那契数列
    {
        let fibonacci = function* () {
            let [prev, curr] = [0, 1];
            for (; ;) {
                yield curr;
                [prev, curr] = [curr, prev + curr];
            }
        };
        for (let n of fibonacci()) {
            if (n > 1000) break;
            console.log(n);
        }
        // 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
    }
    //遍历任意对象
    //原生的JavaScript对象没有内置可迭代对象，无法使用for...of循环。可以利用Generator函数生成迭代器遍历对象的属性
    let obj = {
        name: 'Junior',
        age: 100
    }
    //第一种写法
    {
        let objectEntries = function* (obj) {
            let propKeys = Reflect.ownKeys(obj);
            for (let propKey of propKeys) {
                yield [propKey, obj[propKey]];
            }
        };
        for (let [key, value] of objectEntries(obj)) {
            console.log(`${key}: ${value}`);
        }
        // name: Junior
        // age: 100
    }
    //第二种写法
    {
        //把Generator函数加到对象的 Symbol.Iterator 属性上
        let objectEntries = function* () {
            let propKeys = Object.keys(this);
            for (let propKey of propKeys) {
                yield [propKey, this[propKey]];
            }
        };
        obj[Symbol.iterator] = objectEntries;
        for (let [key, value] of obj) {
            console.log(`${key}: ${value}`);
        }
        // name: Junior
        // age: 100
    }
}
// Generator.prototype.throw()
{
    console.log('>>>>>>>>>>> 6');
    //示例
    {
        let g = function* () {
            try {
                yield;
            } catch (e) {
                console.error('内部捕获', e);
            }
        };
        let ite = g();
        ite.next();
        try {
            ite.throw('a');
            // throw()可接受一个参数，该参数会被catch语句接收，建议传递 Error对象的实例
            ite.throw(new Error('未知错误'));
        } catch (e) {
            console.error('外部捕获', e.message);
        }
        //内部捕获 a
        //外部捕获 未知错误
    }
    //throw()语句会附带执行一次next()
    {
        let g = function* () {
            try {
                yield console.log('a');
            } catch (e) {
                console.error(e.message);
            }
            yield console.log('b');
            yield console.log('c');
        }

        let ite = g();
        ite.next();
        // a
        ite.throw(new Error('内部错误'));
        // 内部错误
        // b
        ite.next();
        // c
    }
    //如果函数体内没有try...catch语句，那么throw()抛出的错误将被外部catch捕获
    {
        let g = function* () {
            let i = 1;
            while(true) {
                yield console.log(`第${i++}次`);
                console.log('内部捕获', e);
            }
        };
        let ite = g();
        console.log(ite.next().done);
        // 第1次
        // false

        try {
            console.log(ite.throw(new Error('未知错误')).done);
        }catch(e) {
            console.error('外部捕获', e);
            //外部捕获
            //Error: 未知错误
        }
        console.log(ite.next().done);
        // true
    }
    /**
     * 总结：
     * 1.如果函数体内没有部署try...catch语句，抛出的错误将于外部捕获
     * 2.如果函数内外部都没有部署try...catch语句，程序将报错，中断执行
     * 3.使用throw()之前至少执行过一次next()，否则将直接被外部catch语句捕获
     * 4.throw()除了可被内部catch()捕获，还会附带执行一次next()
     * 5.如果遍历器对象在遍历内部状态的过程中抛出错误，且Generator函数内没有部署try...catch语句，就不会再执行下去了。之后再次调用next()将返回对象{value: undefined, done: true}，表示已内部状态已被遍历完
     */
}
// Generator.prototype.return()
{
    console.log('>>>>>>>>>>> 7');
    // 返回指定的值 并结束遍历Generator函数
    {
        let g = function* () {
            let s = 1;
            while(true) {
                yield s++;
            }
        };
        let ite = g();
        console.log(ite.next()); // {value: 1, done: false}
        console.log(ite.return('foo')); // {value: 'foo', done: true}
        console.log(ite.next()); // {value: undefined, done: true}
    }
    // 当Generator函数内有try...finally语句时，return()会推迟到finally语句执行完再执行
    {
        let g = function* () {
            try {
                yield 1;
                yield 2;
            } finally {
                yield 3;
                yield 4;
            }
        };
        let ite = g();
        console.log(ite.next()); // {value: 1, done: false}
        console.log(ite.return(100)); // {value: 3, done: false}
        console.log(ite.next()); // {value: 4, done: false}
        console.log(ite.next()); // {value: 100, done: true}
    }
}
// next()、throw()、return()的共同点
{
    console.log('>>>>>>>>>>> 8');
}
// yield* 表达式
{
    console.log('>>>>>>>>>>> 9');
    {
        let g_inner = function* () {
            yield 'inner_a';
            yield 'inner_b';
        };

        // 如果在一个Generator函数内部调用另一个Generator函数，默认情况下是没有效果的
        let g_outter1 = function* () {
            yield 'outter_a';
            g_inner();
            yield 'outter_b';
        };
        for(let ite of g_outter1()) {
            console.log(ite);
        }
        // outter_a
        // outter_b

        // 解决方式：使用 yield* 表达式
        let g_outter2 = function* () {
            yield 'outter_a';
            yield* g_inner();
            yield 'outter_b';
        };
        for(let ite of g_outter2()) {
            console.log(ite);
        }
        // outter_a
        // inner_a
        // inner_b
        // outter_b
    }
    // Generator函数内使用yield* 后面跟一个可迭代对象(Array、String、Set、Map等) 相当于for...of
    {
        let g = function*() {
            yield* ['a', 'b', 'c'];
            //等同于
            // for(let i of ['a','b','c']) {
            //     yield i;
            // }
        };
        let ite = g();
        console.log(ite.next()); // {value: 'a', done: false}
    }
    // 如果 yield* 后面的Generator函数有return语句，可以在外层Generator函数中接收
    {
        let g_inner = function* () {
            yield 'inner_1';
            yield 'inner_2';
            return 'inner';
        };
        let g_outter = function* () {
            yield 'outter_1';
            const innerReturn = yield* g_inner();
            console.log(`innerReturn: ${innerReturn}`);
            yield 'outter_2';
        };
        let ite = g_outter();
        let co = 1;
        for(let i of ite) {
            console.log(`第${co++}次:`);
            console.log(i);
        }
        // 第1次:
        // outter_1
        // 第2次:
        // inner_1
        // 第3次:
        // inner_2
        // innerReturn: inner
        // 第4次:
        // outter_2
    }
}
// 作为对象属性的 Generator函数
{
    console.log('>>>>>>>>>>> 10');
    let obj = {
        * myGeneratorMethod() {
            
        }
    };
}
// Generator函数中的this
{
    console.log('>>>>>>>>>>> 11');
    // ES6 规定返回的遍历器对象是Generator函数的实例，所以可继承Generator函数原型对象
    {
        let g = function* () {};
        g.prototype.hello = function() {
            return 'hi';
        };
        let ite = g();
        console.log(ite instanceof g); // true
        console.log(ite.hello()); // hi
    }
    // Generator函数可以向普通函数一样 在执行环境中绑定this
    {
        let G = function* () {
            this.a = 1;
            yield this.b = 2;
            yield this.c = 3;
        };
        
        // 使用一个空对象绑定this
        let obj = {};
        let g1 = G.call(obj);
        console.log(g1.next()); // {value: 2, done: false}
        console.log(g1.next()); // {value: 3, done: false}
        console.log(obj.a); // 1
        console.log(obj.b); // 2

        // 将绑定的this和返回的遍历器对象结合起来
        let g2 = G.call(G.prototype);
        console.log(g2.next()); // {value: 2, done: false}
        console.log(g2.next()); // {value: 3, done: false}
        console.log(g2.a); // 1
        console.log(g2.b); // 2

        //使用构造函数改造，生成不同的遍历器实例
        let Ite = function() {
            return G.call(G.prototype);
        };
        let ite = new Ite();
        console.log(ite.next()); // {value: 2, done: false}
        console.log(ite.next()); // {value: 3, done: false}
        console.log(ite.a); // 1
        console.log(ite.b); // 2
    }

}
// 