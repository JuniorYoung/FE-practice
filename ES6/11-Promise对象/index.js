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

//基本用法
{
    // 创建 Promise 实例，会立即执行
    const promise = new Promise((resolve, reject) => {
        console.log('Promise');
        resolve();
    });
    // 指定 resolved 和 rejected的回调函数, then方法指定的回调函数将在当前脚本所有同步任务执行完才会执行
    promise.then(() => {
        console.log('resolved');
    }, () => {
        console.log('rejected');
    });
    console.log('hi');
    // Promise
    // hi
    // resolved

    // 设定一段时间后才发生
    let timeout = (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms, 'done');
        });
    };
    timeout(2000).then((value) => {
        console.log(value);
    });
    // done

    // 实现Ajax操作
    {
        if (root.document) {
            document.getElementById('getJSONBtn').onclick = function () {
                getJSON('test.json').then((json) => {
                    console.log('返回数据: ');
                    console.log(json);
                }, (error) => {
                    console.error('出错了', error);
                });
            };
        }
    }

    // 当把一个Promise的实例作为响应传递给resolve回调函数时，即将一个异步操作的结果返回给另一个异步操作
    {
        // p1的状态决定p2的状态。如 3s 后，p1的状态为rejected，会导致p2的状态也变为rejected
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('fail')), 3000);
        });
        const p2 = new Promise((resolve, reject) => {
            setTimeout(() => resolve(p1), 1000);
        });
        p2.then(resp => console.log(resp), error => console.log(error));
        // Error: fail
    }

    // 如果 resolve或reject的调用语句后面还有其他代码，那么调用会在其后面的代码执行结束后再执行
    // 所以一般在调用时加return，如 return resolve(resp); / return reject();
}
// Promise.prototype.then()
{
    // 该方法返回一个新的Promise实例，因此可以采用链式写法
    if(root.document) {
        document.getElementById('getJSONChainBtn').onclick = function() {
            getJSON('test.json').then((resp) => {
                return resp.result;
            }).then((resp) => {
                console.log(resp);
            });
        };
    }

    // 使用链式写法时，当前一个回调函数返回一个Promise实例时，后序的回调函数会等待该Promise实例的状态发生变化时才会被调用
}
// Promise.prototype.catch()
{
    // catch() 是 Promise.prototype.then(null, rejection) 的别名，用于处理Promise内部抛出的错误（Promise状态变为rejected时调用）
    if(root.document) {
        document.getElementById('getJSONCatchBtn').onclick = function() {
            getJSON('test.json').then((resp) => {

            }).catch((error) => {
                console.error(error);
            });
        };
    }

    /**
     * 1. 当Promise实例的状态变为rejected，会调用catch()，相当于then()的第二个参数
     * 2. Promise执行过程中抛出错误，会调用catch()
     */
    {
        const p1 = new Promise((resolve, reject) => {
            throw new Error('test p1');
        });
        p1.then((resp) => {})
          .catch((error) => {
            console.log(error);
        });
        // Error: test p1

        //等同于
        const p2 = new Promise((resolve, reject) => {
            try {
                throw new Error('test p2');
            } catch (e) {
                reject(e);
            }
        });
        p2.then(resp => {})
          .catch(error => console.log(error));
        // Error: test p2
    }

    // 1.Promise实例抛出的错误具有“冒泡”性质，抛出后会一直向后传递，直到被catch()捕获
    // 2.建议使用catch()，而不使用then()的第二个参数。因为catch()可以捕获then()执行过程中抛出的错误
    // 3.如果未指定catch()，Promise执行过程中抛出的错误不会像一般情况下终止脚本，不会影响到Promise外部的代码，就像是“Promise吃掉了错误”
    {
        const p1 = new Promise((resolve, reject) => {
            resolve('p1: success');
        });
        p1.then((resp) => {
            console.log(resp);
            throw new Error('catch test p1');
        }, (error) => {
            console.log(error);
        });
        // p1: success
        // Uncaught (in promise) Error: catch test p1

        const p2 = new Promise((resolve, reject) => {
            resolve('p2: success');
        });
        p2.then(resp => {
            console.log(resp);
            throw new Error('catch test p2');
        }).catch(error => {
            console.log(error);
        });
        // p2: success
        // Error: catch test p2
    }
}
//Promise.prototype.finally() [ES2018引入]
{
    // 不管Promise实例最后状态是什么，都会执行finally指定的回调函数
    
}
// Promise.all()
{
    // 接收一个可迭代对象作为参数，且该对象的每个成员都是Promise实例，如果某个成员不是Promise实例，则调用Promise.resolve()转换
    // 返回一个新的Promise实例

    {
        const resolveP1 = new Promise((resolve, reject) => {
            setTimeout(resolve, 5000, 'resolveP1');
        });
        const resolveP2 = new Promise((resolve, reject) => {
            setTimeout(resolve, 4000, 'resolveP2');
        });
        const resolveP3 = new Promise((resolve, reject) => {
            setTimeout(resolve, 3000, 'resolveP3');
        });
        const resolveP4 = new Promise((resolve, reject) => {
            setTimeout(resolve, 2000, 'resolveP4');
        });
        const rejectP1 = new Promise((resolve, reject) => {
            setTimeout(reject, 2000, 'error: rejectP1');
        });

        const resolveP = Promise.all([resolveP1, resolveP2, resolveP3, resolveP4]);
        resolveP.then((value) => {
            console.log('Promise.all(): ' + value);
        });
        // Promise.all(): resolveP1,resolveP2,resolveP3,resolveP4

        const rejectP = Promise.all([resolveP1, resolveP2, resolveP3, resolveP4, rejectP1]);
        rejectP.then((value) => {
            console.log('Promise.all(): ' + value);
        }).catch((error) => {
            console.error('Promise.all(): '+ error);
        });
        // Promise.all(): error: rejectP1
    }
}
// Promise.race()
{
    // 参数与 Promise.all() 一样
    // 返回一个新的Promise实例，该实例的状态由所传递的一组Promise对象中第一个改变状态的实例决定
    
    // 状态为 resolved
    {
        const p1 = new Promise(function(resolve, reject) { 
            setTimeout(resolve, 500, "Promise.race() one"); 
        });
        const p2 = new Promise(function(resolve, reject) { 
            setTimeout(resolve, 100, "Promise.race() two"); 
        });
        const p = Promise.race([p1, p2]);
        p.then((value) => {
            console.log(value);
        });
        // Promise.race() two
    }

    // 状态为 rejected
    {
        const p1 = new Promise(function(resolve, reject) { 
            setTimeout(resolve, 500, "Promise.race() one"); 
        });
        const p2 = new Promise(function(resolve, reject) { 
            setTimeout(reject, 100, "error: Promise.race() two"); 
        });
        const p = Promise.race([p1, p2]);
        p.then((value) => {
            console.log(value);
        }).catch((error) => {
            console.error(error);
        });
        // error: Promise.race() two
    }
}
// Promise.resolve()
{
    console.log('>>>>>>>>>>>>>>>> Promise.resolve()');
    // 参数是 Promise实例 ，则返回该实例
    
    // 参数是 thenable 对象（具有then()的对象），则此对象的状态决定返回的Promise对象的状态
    {
        const p = Promise.resolve({
            then: (onFulfilled, onRejection) => {
                // onRejection('error'); // 返回的Promise实例状态为rejected
                onFulfilled('success'); // 则返回的Promise实例状态为resolved
            }
        });
        p.then((resp) => {
            console.log(resp);
        }, (error) => {
            console.error(error);
        });
        // success
    }

    // 参数是一个原始值 如数组 字符串 数值等
    {
        const p = Promise.resolve('hello world');
        p.then((resp) => {
            console.log(resp);
        });
        // hello world
    }
    
    // 不带参数，返回一个 resolved状态的Promise对象
    {
        setTimeout(function() {
            console.log('three');
        }, 0);
        Promise.resolve().then(function() {
            console.log('two');
        });
        console.log('one');
        // one
        // two
        // three
    }
    
}
// Promise.reject()
{
    // 返回的Promise实例状态为rejected
    const p = Promise.reject('test Promise.reject()');
    //等同于
    // const p = new Promise((resolve, reject) => reject('text Promise.reject()'));
    p.then(() => {})
     .catch((error) => {
         console.error(error);
     });
    // test Promise.reject()
}
// Promise.try
{}
// Generator函数与Promise结合使用
{
    // 一般用于使用Generator函数管理流程时，遇到异步操作的情况下。
    let getFoo = () => {
        return new Promise((resolve, reject) => {
            reject('异步操作返回： foo fail');
        });
    };
    const g = function* () {
        try {
            const foo = yield getFoo();
            console.log('异步操作返回: ' + foo);
        } catch (error) {
            console.error(error);
        }
    };
    const run = (generator) => {
        const ite = generator();
        
        const go = (result) => {
            if(result.done) {
                return result.value;
            }
            result.value.then((resp) => {
                return go(ite.next(resp));
            }).catch((error) => {
                return go(ite.throw(error));
            });
        }

        go(ite.next());
    };
    console.log(run(g));
    // 异步操作返回: foo success
}