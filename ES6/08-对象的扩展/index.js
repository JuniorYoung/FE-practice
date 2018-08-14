// 属性的简洁表示法：支持直接写入变量和函数
{
    const foo = 'baz';
    function consoleMethod() {
        console.log('hello world');
    }
    const obj1 = {
        foo, // 等同于 foo: foo
        print() { // 等同于 print: function() {...}
            console.log(this.foo);
        },
        consoleMethod
    };
    obj1.print();
    obj1.consoleMethod();
    // baz
    // hello world
}

// 使用字面量方式定义对象时，允许使用表达式定义属性名和方法名，表达式要放置在方括号内
{
    const propKey = 'name';
    const obj = {
        foo: 'baz',
        [propKey]: 'Junior',
        ['a' + 'bc']: 'value is abc',
        ['print' + propKey]() {
            console.log(this[propKey]);
        }
    };
    console.log(obj.abc);
    obj['print' + propKey]();
    // value is abc
    // Junior

    // 注意：使用属性名表达式定义方法名时可以与简洁表示法结合使用，定义属性名时不可结合使用
    const bbq = 'MDN';
    const fbi = 'FBI';
    const obj1 = {
        // [fbi],  // 报错
        [bbq]() {
            console.log('this is MDN');
        }
    };
    obj1.MDN();
    // this is MDN
}

// 方法的 name 属性
{
    // 对象方法的 name 属性与函数的 name 属性相同，返回函数名

    // 对象的方法使用了取值函数(getter)和存值函数(setter)
    {
        const obj = {
            set foo(value) {  },
            get foo() {  }
        };
        // console.log(obj.foo.name); // TypeError: Cannot read property 'name' of undefined

        const objDescriptor = Object.getOwnPropertyDescriptor(obj, 'foo'); // 获取该属性的描述符对象
        console.log(objDescriptor.set.name);
        // set foo
        console.log(objDescriptor.get.name);
        // get foo
    }

    // 使用 bind() 绑定生成的新函数 ，name属性为 'bound' 加上原函数的名字
    {
        const m1 = () => {};
        const m2 = m1.bind();
        console.log(m2.name);
        // bound m1
    }

    // 使用 Function() 构造函数创建的函数，name属性返回 anonymous
    {
        const m = new Function();
        console.log(m.name);
        // anonymous
    }

    // 对象的方法名是个Symbol值，name属性返回这个Symbol值的描述
    {
        const sym = Symbol('desc method');
        const obj = {
            [sym]() {}
        };
        console.log(obj[sym].name);
        // [desc method]
    }
}

// Object.is()
{
    // 严格相等运算符有两个缺点：+0 === -0、 NaN不等于自身
    console.log( +0 === -0); // true
    console.log( NaN === NaN); // false

    // Object.is() 的行为与 === 基本一致，且修复了以上两个缺点
    console.log(Object.is(+0, -0)); // false
    console.log(Object.is(NaN, NaN)); // true

    // 使用 ES5的方式实现此方法功能
    {
        Object.defineProperty(Object, 'is', {
            value(x, y) {
                if(x === y) {
                    return x !== 0 || ( 1 / x === 1 / y);
                }
                return x !== x && y !== y;
            },
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
}

// Object.assign()
{
    // 拷贝所有源对象(source) 自有的 可枚举属性 至目标对象(target)，不包括源对象继承的属性
    // 目标对象与（多个）源对象存在同名属性时，越往后的源对象的同名属性替换掉目标对象的
    // 只执行“浅拷贝”，不执行“深拷贝”
    {
        const target = {
            name: 'Junior',
            age: 100
        };
        const source1 = { a: 'a', 'b': 'b', age: 150};
        const source2 = { c: 'c', age: 200};
        Object.assign(target, source1, source2);
        console.log(target);
        // {name: "Junior", age: 200, a: "a", b: "b", c: "c"}
    }

    // 将 undefined 和 null 作为首参会报错
    // Object.assign(null); // Cannot convert undefined or null to object
    // Object.assign(undefined);

    // 非对象参数作为源对象，这些参数会先转为对象，如果无法转为对象，就会跳过
    {
        const v1 = true;
        const v2 = 11;
        const v3 = 'hello';
        const obj = Object.assign({}, v1, v2, v3, null, undefined);
        console.log(obj);
        // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}

        // 数值和布尔值转换成对象时，他们的原始值在包装对象的[[PrimitiveValue]]中，此属性不可枚举
    }

    // 属性使用取值函数时，只拷贝最终值
    {
        const source = {
            get foo() { return 1;}
        };
        const target = Object.assign({}, source);
        console.log(target);
        // { foo: 1 }
    }
}

// Object.getOwnPropertyDescriptors()

// Object.keys()、Object.values()、Object.entries()

// 对象的扩展运算符