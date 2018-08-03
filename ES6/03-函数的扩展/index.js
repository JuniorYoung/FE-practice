//参数默认值
{
    function log(x = 1, y = 2) {
        console.log(x, y);
    }
    log();
}
//与解构赋值结合使用
{
    function log({ x: x_, y = 2 }) {
        console.log(x_, y);
    }
    try {
        log();
    } catch (error) {
        console.error(error); // TypeError: Cannot destructure property `x` of 'undefined' or 'null'.
    }
    log({}); // undefined 2
    log({ x: 1 }); // 1 2
    log({ x: 1, y: 3 }); // 1 3
}
//比较以下两种提供函数参数默认值的写法
{
    // 写法一
    function m1({ x = 0, y = 0 } = {}) {
        console.log([x, y]);
    }

    // 写法二
    function m2({ x, y } = { x: 0, y: 0 }) {
        console.log([x, y]);
    }

    // 函数没有参数的情况
    m1() // [0, 0]
    m2() // [0, 0]

    // x 和 y 都有值的情况
    m1({ x: 3, y: 8 }) // [3, 8]
    m2({ x: 3, y: 8 }) // [3, 8]

    // x 有值，y 无值的情况
    m1({ x: 3 }) // [3, 0]
    m2({ x: 3 }) // [3, undefined]

    // x 和 y 都无值的情况
    m1({}) // [0, 0];
    m2({}) // [undefined, undefined]

    m1({ z: 3 }) // [0, 0]
    m2({ z: 3 }) // [undefined, undefined]
}
//函数的length属性
{
    console.log((function(a) {}).length); // 1
    console.log((function(a, b = 5) {}).length); // 1
    console.log((function(a, b = 5, c) {}).length); // 1
}
//函数参数作用域问题
{
    {
        var x = 1;
        function f(x, y = x) {
            console.log(y);
        }
        f(2); // 2
    }
    {
        let x = 1;
        function f(y = x) {
            let x = 2;
            console.log(y);
        }
        f(); // 1
    }
    {
        var x = 3;
        function f(x = x) {
            console.log(x);
        }
        try {
            f();
        } catch(error) {
            console.error(error); // ReferenceError: x is not defined
        }
    }
    {
        let bar = (func = () => foo) => {
            let foo = 'inner';
            console.log(func());
        }
        try {
            bar();
        } catch(error) {
            console.error(error); // ReferenceError: foo is not defined
        }
    }
    {
        var x = 1;
        let foo = (x, y = () => { x = 2; }) => {
            var x = 3;
            y();
            console.log(x);
        };
        foo(); // 3
        console.log(x); // 1
    }
}
//函数默认值的用途 约定某一个参数不得省略 否则就抛出错误
{
    let throwIfMissing = () => {
        throw new Error('Missing parameter');
    };
    let foo = (param = throwIfMissing()) => {
        return param;
    };
    try {
        foo();
    } catch(error) {
        console.error(error); // Error: Missing parameter
    }
}
//rest参数
{
    let sum = (...nums) => nums.reduce((prevNum, currentNum) => prevNum + currentNum);
    console.log(sum(1, 2, 3, 4, 5));
}
//箭头函数
{
    {
        let fn = () => void console.log('not return');
        fn();
    }
    //与rest参数结合使用
    {
        const headAndTail = (head, ...tail) => [head, tail];
        console.log(headAndTail(1, 2, 3, 4, 5));
    }
    //this指向
    {
        var id = 1;
        let foo = function() {
            setTimeout(() => void console.log(this.id), 100);
        };
        foo.call({id: 2}); // 2
    }
    {
        function Timer() {
            this.s1 = 0;
            this.s2 = 0;
            setInterval( () => this.s1++, 1000); //this 指向定义时所在的作用域 即 Timer函数
            setInterval(function() {
                this.s2++; // this 指向运行时所在的作用域 即全局对象
            }, 1000);
        }
        let timer = new Timer();
        setTimeout(() => console.log('s1: ', timer.s1), 3100); // 3
        setTimeout(() => console.log('s2: ', timer.s2), 3100); // 0
    }
}
//尾调用与尾递归
{
    //阶乘函数示例

    //不使用尾调用，最多需要保存 n 个调用记录  复杂度 O(n)
    {
        function factorial(n) {
            if(n === 1) return 1;
            return n * factorial(n - 1); 
        }
        console.log(factorial(10)); // 3628800
    }
    //使用尾调用优化后
    {
        //只保留 1 个调用记录 复杂度 O(1)
        function factorial(n, total = 1) {
            if(n === 1) return total;
            return factorial(n - 1, n * total);
        }
        console.log(factorial(10)); // 3628800
    }
    
    //斐波那契数列 （Fibonacci）
    
    //不使用尾调用
    // {
    //     function Fibonacci(n) {
    //         if(n <= 1) return 1;
    //         return Fibonacci(n - 1) + Fibonacci(n - 2);
    //     }
    //     console.log(Fibonacci(10)); // 89
    //     try {
    //         console.log(Fibonacci(100))
    //     } catch(error) {
    //         console.error(error);
    //     }
    //     // console.log(Fibonacci(500));
    // }
    //使用尾调用优化后
    {
        function Fibonacci(n, ac1 = 1, ac2 = 1) {
            if(n <= 1) return ac2;
            return Fibonacci(n - 1, ac2, ac1 + ac2);
        }
        console.log(Fibonacci(100)); // 573147844013817200000
        console.log(Fibonacci(1000)); // 7.0330367711422765e+208
    }
}