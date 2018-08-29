// 1. 基本用法
{
    // 对一个空对象设置访问拦截，拦截属性的读取和赋值行为
    {
        const obj = new Proxy({}, {
            get: function (target, key, receiver) {
                console.log(`getting ${key}`);
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                console.log(`setting ${key}`);
                return Reflect.set(target, key, value, receiver);
            }
        });
        obj.count = 1;
        // setting count
        console.log(++obj.count);
        // getting count
        // setting count
        // 2
    }

    // Proxy实例作为其他对象的原型
    {
        const proxy = new Proxy({
            name: 'junior'
        }, {
            get: function (target, key, receiver) {
                console.log(`getting ${key}`);
                return Reflect.get(target, key, receiver);
            }
        });
        const obj = Object.create(proxy);
        console.log(obj.name);
        // getting name
        // junior
    }

    // 配置多个拦截操作
    {
        const fproxy = new Proxy(function (x, y) {
            return x + y;
        }, {
            get: function (target, name) {
                if (name === 'prototype') {
                    return Object.prototype;
                }
                return 'Hello, ' + name;
            },

            apply: function (target, thisBinding, args) {
                return args[0];
            },

            construct: function (target, args) {
                return {
                    value: args[1]
                };
            }
        });
        // 调用函数，触发 apply 拦截操作
        console.log(fproxy(1, 2)); // 1
        
        // 作为构造函数被调用，触发 construct 拦截操作
        console.log(new fproxy(1, 2)); // { value: 2 }

        // 获取函数的属性， 触发 get 拦截操作
        console.log(fproxy.prototype === Object.prototype); // true
        console.log(fproxy.foo === 'Hello, foo'); // true
    }
}

// 2. Proxy支持的拦截器配置对象的可用方法
{
    // Any get(target, propKey[, receiver])
    {
        const person = { name: 'Junior' };
        const proxy = new Proxy(person, {
            get: function(target, propKey, receiver) {
                if(propKey in target) {
                    return target[propKey];
                } else {
                    throw new ReferenceError('属性不存在');
                }
            }
        });
        console.log(proxy.name); // Junior
        try {
            console.log(proxy.age); 
        } catch (e) {
            console.error(e);
        }
        // ReferenceError: 属性不存在

        /**
         * 1. 第三个参数表示操作行为所在的那个对象
         * 2. 当继承自proxy实例的对象操作属性触发拦截操作时(如下面的对象obj)，该参数指向操作的对象(obj)，而非Proxy实例
         * 3. 当使用Proxy实例操作属性时，该参数指向Proxy实例
         */
        const obj = Object.create(proxy);
        console.log(obj.name); // Junior

        // 如果一个属性为不可配置(configurable: false)和不可写(writable: false)，则Proxy不能在get拦截操作中修改该属性，否则会报错
        {
            const obj = {};
            Object.defineProperty(obj, 'foo', {
                writable: false,
                configurable: false,
                enumerable: false,
                value: 'foo value'
            });
            const p = new Proxy(obj, {
                get: function(target, propKey) {
                    // 默认 return target[propKey]; 
                    return 'abc';
                }
            });
            try {
                console.log(p.foo);
            } catch (e) {
                console.error(e);
            }
            // TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'foo value' but got 'abc')
        }
    }

    // Boolean set(target, propKey, value[, receiver])
    {
        // 拦截赋值行为，可用于条件赋值
        {
            let personProxy = new Proxy({}, {
                set: function(target, propKey, value, receiver) {
                    if(propKey === 'age') {
                        // 年龄非数值类型
                        if(!Number.isInteger(value)) {
                            throw new TypeError('the age is not an integer.');
                        }
                        // 年龄超过最大值
                        if(value > 200) {
                            throw new RangeError('the age seems invalid.');
                        }
                    }
                    // 符合条件的值
                    target[propKey] = value;
                }
            });
    
            try {
                personProxy.age = 'string';
            } catch (e) {
                console.error(e);
            }
            // TypeError: the age is not an integer.
            try {
                personProxy.age = 300;
            } catch (e) {
                console.error(e);
            }
            // RangeError: the age seems invalid.
            personProxy.age = 100;
        }

        // 通过使用 Proxy 和 get / set 拦截方法，实现以'_'开头的内部属性无法被外部读写
        {
            const target = {
                _p1: 'abc'
            };
            const isPrivate = (key, action) => {
                if(key[0] === '_') {
                    throw new Error(`can not attempt to ${action} private ${key} property.`);
                }
            };
            const tproxy = new Proxy(target, {
                get: function(target, propKey, receiver) {
                    isPrivate(propKey, 'get');
                    return target[propKey];
                },
                set: function(target, propKey, value, receiver) {
                    isPrivate(propKey, 'set');
                    target[propKey] = value;
                    return true;
                }
            });
            try {
                console.log(tproxy._p1);
            } catch (e) {
                console.error(e);
            }
            // Error: can not attempt to get private _p1 property.

            try {
                tproxy._p1 = '123';
            } catch (e) {
                console.error(e);
            }
            // Error: can not attempt to set private _p1 property.
        }

        // 如果一个属性为不可写(writable: false)且不可配置(configurable: false)，set()将不起作用
        {
            const obj = {};
            Object.defineProperty(obj, 'name', {
                // configurable: true,
                value: 'junior',
                // writable: false
            });
            const proxy = new Proxy(obj, {
                set: function(target, propKey, value, receiver) {
                    target[propKey] = value;
                }
            });
            proxy.name = 'junior_change';
            console.log(proxy.name);
            // junior
        }

    }

    // Boolean has(target, propKey)
    {
        // 拦截 key in target 的操作，判断对象是否包含某个属性（包含可枚举和不可枚举、自有属性和原型属性）
        {
            const obj = {
                _prop: '123',
                prop: 'abc'
            };
            Object.defineProperty(obj, 'foo', {
                enumerable: false
            });
            const proxy = new Proxy(obj, {
                has: function(target, propKey) {
                    if(propKey[0] === '_') {
                        return false;
                    }
                    return propKey in target;
                }
            });
            console.log('foo' in proxy); // true
            console.log('prop' in proxy); // true
            console.log('_prop' in proxy); // false
        }

        // 如果某个属性不可配置或目标对象不可扩展，触发 has() 拦截会报错
        {
            const obj = { a: 'abc'};
            Object.defineProperty(obj, 'foo', {
                configurable: false
            });
            Object.preventExtensions(obj); // 设置对象为不可扩展
            const proxy = new Proxy(obj, {
                has: function(target, propKey) {
                    return false;
                }
            });
            try {
                console.log('a' in proxy);
            } catch (e) {
                console.error(e);
            }
            // TypeError: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible

            try {
                console.log('foo' in proxy);
            } catch (e) {
                console.error(e);
            }
            // TypeError: 'has' on proxy: trap returned falsish for property 'foo' which exists in the proxy target as non-configurable
        }

        // for...in 不会触发 has() 拦截
    }

    // Boolean deleteProperty(target, propKey)
    {
        /**
         * 1.拦截对象属性的 delete 操作
         * 2.如果目标对象的某个属性为不可配置(configurable: false)，触发该拦截方法会报错
         */
        const obj = {
            _prop: 'abc'
        };
        Object.defineProperty(obj, 'foo', {
            configurable: false
        });
        const proxy = new Proxy(obj, {
            deleteProperty: function(target, propKey) {
                if(propKey[0] === '_') {
                    throw new Error('can not delete private variable.');
                }
                delete target[propKey];
                return true;
            }
        });
        try {
            delete proxy._prop;
        } catch (e) {
            console.error(e);
        }
        // Error: can not delete private variable.

        try {
            delete proxy.foo;
        } catch (e) {
            console.error(e);
        }
        // TypeError: 'deleteProperty' on proxy: trap returned truish for property 'foo' which is non-configurable in the proxy target
    }

    // Array ownKeys(target)
    {
        /**
         * 以下操作触发此拦截方法
         * 1. Object.getOwnPropertyNames()
         * 2. Object.getOwnPropertySymbols()
         * 3. Object.keys()：
         *      使用此方法触发时，有三类属性会被拦截方法过滤掉
         *      2).目标对象上不存在的属性
         *      3).不可枚举属性
         *      4).属性名为Symbol值
         * 4. for...in
         * 
         * 注意：
         * 1.返回的数组的所有成员必须是字符串或Symbol值，包含其他类型会报错
         * 2.如果目标属性某个属性是不可配置(configurable: false)，则该属性必须被返回，否则报错
         * 3.如果目标对象为不可扩展，则必须返回目标对象的所有属性且不能包含多余属性，否则报错
         */
        let obj = {
            [Symbol.for('foo')]: 'abc',
            a: 'a_',
            b: 'b_',
            c: 'c_'
        };

        Object.defineProperty(obj, 'notEnum', {
            enumerable: false,
            value: 'not enumerable'
        });
        // Object.preventExtensions(obj); // 目标对象不可扩展，'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
        const proxy = new Proxy(obj, {
            ownKeys: function(target) {
                // return ['a', 'b', 11]; // 包含非字符串和非Symbol类型值，报错：11 is not a valid property name
                // return ['a', 'b']; // 属性 notEnum 为不可配置，返回数组中不包含该属性，报错：'ownKeys' on proxy: trap result did not include 'notEnum'
                return ['a', 'b', 'c', 'd', Symbol.for('foo'), 'notEnum'];
            }
        });
        try {
            console.log(Object.keys(proxy)); // ["a", "b", "c"]
            console.log(Object.getOwnPropertyNames(proxy)); // ["a", "b", "c", "d", "notEnum"]
            console.log(Object.getOwnPropertySymbols(proxy)); // [Symbol(foo)]
            for(const i in proxy) {
                console.log(i);
            }
            // a
            // b
            // c
        } catch (e) {
            console.error(e);
        }

    }

    // getOwnPropertyDescriptor(target, propKey)
    {

    }

    // defineProperty(target, propKey, propDesc)

    // preventExtensions(target)

    // getPrototypeOf(target)

    // isExtensible(target)

    // setPrototypeOf(target, proto)

    // apply(target, object, args)

    // construct(target, args)
}

// 3. Proxy.revocable()
{
    // 返回一个可撤销的代理对象
    const target = {};
    const {proxy, revoke} = Proxy.revocable(target, {});
    proxy.foo = 'abc';
    console.log(proxy.foo); // abc

    // 调用撤销函数
    revoke();

    try {
        console.log(proxy.foo);
    } catch (e) {
        console.error(e);
    }
    // TypeError: Cannot perform 'get' on a proxy that has been revoked

}

// 4. 使用Proxy时的this问题
{
    // 在 Proxy 代理的目标对象，其内部的this关键字指向Proxy实例
    const target = {
        m: function() {
            console.log(this === proxy);
        }
    };
    const proxy = new Proxy(target, {});
    target.m(); // false
    proxy.m(); // true
}