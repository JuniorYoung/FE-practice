const root = typeof self == 'object' && self.self === self && self
    || typeof global === 'object' && global.global === global && global
    || this;

const getJSON = (url) => {
    const promise = new Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }
            if ((this.status >= 200 && this.status < 300) || this.status === 304) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send(null);
    });
    return promise;
};
// ES2017标准引入 async 函数
/**
 * async函数改进了Generator函数
 * 1. 内置执行器
 * 2. 更好的语义
 * 3. 更广的适用性
 * 4. 返回值是Promise对象
 */

// 基本用法
{
    const timeoutCall = (value, ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, value);
        });
    };
    async function printStr(str, ms) {
        return await timeoutCall(str, ms);
    }
    printStr('hello world', 1000).then((resp) => {
        console.log(resp);
    });
    // hello world
}

// async函数的多种写法
{
    // 函数声明
    async function f1() { }
    // 函数表达式
    const f2 = async function () { };
    // 对象的方法
    const o1 = {
        async f3() { }
    };
    // Class 的写法
    class F4 {
        async getName() { }
    }
    // 箭头函数
    const f5 = async () => { };
}

// async 函数返回的Promise对象
{
    // 函数体内的 return 语句返回的值，使返回的Promise对象状态为resolved，返回值是then函数的参数
    {
        const asyncF1 = async () => {
            const resp = await 'asyncF1 return hello sir';
            return resp;
        };
        asyncF1().then( v => {
            console.log(v);
        });
        // asyncF1 return hello sir
    }

    /**
     * 返回的Promise对象状态变为rejected有两种情况
     * 1. 函数体本身throw
     * 2. 某个await命令后面的Promise状态为rejected
     */
    {
        const asyncF2 = async () => {
            // throw new Error('asyncF2 throw error');
            // or
            await Promise.reject('asyncF2 throw error');
        };
        asyncF2().catch( error => {
            console.error(error);
        });
        // Error: asyncF2 throw error
    }

    /*
     * async函数返回的Promise状态依赖于函数体内所有的await后面的Promise状态
     * 遇到以下三种情况时，async函数中断执行:
     * 1. return语句、
     * 2. throw语句、
     * 3. 某个Promise状态为rejected且该Promise对象没有指定catch()语句
     */
    {
        const asyncF3 = async (url) => {
            let response = await fetch(url);
            let html = await response.text();
            return html.match(/<title>([\s\S]+)<\/title>/i)[1];
        };
        asyncF3('https://tc39.github.io/ecma262/').then( resp => {
            console.log(resp);
        });
        // ECMAScript® 2019 Language&nbsp;Specification

        const asyncF4 = async () => {
            await Promise.reject('asyncF4 throw error');
            await Promise.resolve('asyncF4 resolve');
        };
        asyncF4()
            .then( v => console.log(v)) // 不会执行
            .catch( error => console.error(error));
        // Error: asyncF4 throw error
    }
    
}

// await命令
{
    // await 命令后面的表达式不是Promise对象的话，会转换成一个 resolved状态的Promise对象

    /**
     * await 命令后面的Promise对象状态可能是rejected，从而中断async函数，建议：
     * 1. 把await命令放在 try...catch语句中
     * 2. 给await命令后面的Promise对象指定catch()语句
     */
    {
        const asyncF4 = async () => {
            try {
                await Promise.reject('asyncF4 throw error');
                await Promise.resolve('asyncF4 resolve');
            } catch(error) {
                console.error('捕获：' + error);
            }
        };
        asyncF4()
            .then( v => console.log(v))
            .catch( error => console.error(error)); // 不会执行
        // 捕获：asyncF4 throw error
    }

    // async函数执行时，遇到await命令会先返回，等待此await命令后面的异步操作结束后，再继续执行后面的语句。
    // 所以如果多个await命令后面的异步操作不存在继发关系的话，最好让他们同时触发。
    {
        // 以下两个，getFoo()执行结束后，再执行getBaz()
        // let foo = await getFoo();
        // let baz = await getBaz();

        // 优化为同时触发
        
        // 方法1：
        // await Promise.all([getFoo(), getBaz()]);
        
        // 方法2：
        // let foo = getFoo();
        // let baz = getBaz();
        // await foo;
        // await baz;
    }

}

// async函数的实现原理
{
    // async函数的实现原理，就是将Generator函数和自动执行器包装在一个函数里

    /**
     * 自动执行器
     * @param {GeneratorFunction} genF 
     */
    function spawn(genF) {
        return new Promise(function (resolve, reject) {
            const gen = genF();
            function step(nextF) {
                let next;
                try {
                    next = nextF();
                } catch (e) {
                    return reject(e);
                }
                if (next.done) {
                    return resolve(next.value);
                }
                Promise.resolve(next.value).then(function (v) {
                    step(function () { return gen.next(v); });
                }, function (e) {
                    step(function () { return gen.throw(e); });
                });
            }
            step(function () { return gen.next(undefined); });
        });
    }

    async function fn1(args) {
        // codes
    }
    // 相当于
    function fn2(args) {
        return spawn(function* () {
            // codes
        });
    }
}

// 按顺序完成异步操作
{
    const urls = [
        'test1.json',
        'test2.json',
        'test3.json',
        'test4.json',
    ];
    /**
     * 依次读取一组url，按照读取的顺序输出结果
     * @param {Array} urls 
     */
    let printInOrder = (urls) => {
        const textPromises = urls.map( (url) => {
            return fetch(url).then( (resp) => resp.text())
        });
        textPromises.reduce((chain, textPromise) => {
            return chain.then(() => textPromise).then( text => {
                console.log(text);
            });
        }, Promise.resolve());
    }
    // printInOrder(urls);

    // 使用 async函数优化（多个异步操作非依赖关系，非并发，效率较差）
    async function printInOrderAsync1(urls) {
        for(const url of urls) {
            const resp = await fetch(url);
            console.log(await resp.text());
        }
    }
    // printInOrderAsync1(urls);

    // 使用 async函数优化（多个异步操作非依赖关系，并发，效率更好）
    async function printInOrderAsync2(urls) {
        const textPromises = urls.map(async (url) => {
            const resp = await fetch(url);
            return resp.text();
        });
        for(const textPromise of textPromises) {
            console.log(await textPromise);
        }
    }
    printInOrderAsync2(urls);
}

// 异步迭代器 [ES2018引入]
{
    // 区别同步迭代器，同步的迭代器调用next()立即返回一个具有value和done属性的对象
    // ES2018引入的异步迭代器的next()返回一个Promise对象，该对象的then()的参数是一个具有value和done属性的对象

    // 获取同步迭代器的接口在[Symbol.iterator]属性上
    // 获取异步迭代器的接口在[Symbol.asyncIterator]属性上

}