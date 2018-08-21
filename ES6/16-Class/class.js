// 可以把ES6的class语法看做是ES5方式的语法糖，绝大部分功能都可以用ES5方式实现

// 1. 基本用法
{
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        print() {
            console.log(this.x + ', ' + this.y);
        }
        saveHandle() {
            //
        }
    }
    console.log(typeof Point); // function
    console.log(Point.prototype.constructor === Point); // true
    const p = new Point(2, 3);
    p.print(); // 2, 3

    // 在类中定义的方法都是定义在他的原型对象上
    console.log(Point.prototype);

    // 使用 Object.assign() 向 Point 添加多个方法
    Object.assign(Point.prototype, {
        deleteHandle() {},
        searchHandle() {}
    });
    console.log(Point.prototype);

    // 类的内部定义的方法都是不可枚举的，使用 Object.assign() 添加的是可枚举的
    console.log(Object.keys(Point.prototype)); // ["deleteHandle", "searchHandle"]
    console.log(Object.getOwnPropertyNames(Point.prototype)); // ["constructor", "print", "saveHandle", "deleteHandle", "searchHandle"]

    // 使用ES5的方式添加在原型上的方法是可枚举的
    const Point2 = function () {};
    Point2.prototype.saveHandle = function () {};
    Point2.prototype.deleteHandle = function () {};
    console.log(Object.keys(Point2.prototype)); // ["saveHandle", "deleteHandle"]
}

// 2. 类和模块的内部，默认是严格模式

// 3. constructor()
{
    /**
     * 1.定义一个class时，默认添加空的constructor()；
     * 2.使用 new 生成对象实例时，自动调用此方法；
     * 3.该方法默认返回实例对象，所以可以显示指定返回另一个对象
     */
    class Foo {
        constructor() {
            return Object.create(null);
        }
    }
    console.log(new Foo() instanceof Foo); // false
}

// 4. 使用类生成的对象
{
    // 行为与ES5的方式生成的对象一模一样。

    // 一般在constructor()中使用this指定实例的属性

    // 使用 Object.getPrototypeOf() 或者 实例的__proto__属性获取原型对象，可以为原型对象添加方法或属性，但不建议这样做
}

// 5. class 表达式
{
    // 使用表达式的方式定义class
    // 或者 const MyClass = class { ... }。InnerName 供类的内部使用，指定类的name属性，外部调用时报错。
    const MyClass = class InnerName {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log('My name is ' + this.name);
        }
        printClassName() {
            console.log(InnerName.name);
        }
    };
    const o1 = new MyClass('老习');
    o1.sayName(); // My name is 老习
    o1.printClassName(); // InnerName
    console.log(MyClass.name); // InnerName

    console.log(MyClass.prototype);

    // 立即执行的class
    const o2 = new class {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log(this.name);
        }
    }('Michael Jackson');
    o2.sayName(); // Michael Jackson
}

// 6. 不存在变量提升  类在使用前必须先定义

// 7. 私有方法和私有属性
{
    // 1.规范私有方法的命名 方法名前加下划线 _

    // 2.把私有的方法移到模块外部，模块内使用：privateMethod.call(this[, param1,...])

    // 3.在模块内，利用Symbol值的唯一性，使用Symbol值命名私有方法和私有属性
    const privateMethod1 = Symbol('privateMethod1');
    const privateProp1 = Symbol('privateProp1');
    class MyClass {
        publicMethod1(name) {
                console.log(this[privateMethod1](name));
            }
            [privateMethod1](name) {
                return this[privateProp1] = name;
            }
    }
}

// 8. this的指向
{
    // 类方法内部的this默认指向类的实例
}

// 9. 在class中设置属性的取值函数(getter)和存值函数(setter)
{
    class MyClass {
        constructor() {
            this._age = 0;
        }
        get age() {
            if (this._age === 0) {
                console.log('please set the age');
            }
            return this._age;
        }
        set age(age) {
            if (typeof age !== 'number') {
                throw new TypeError(age + 'is not a number');
            }
            this._age = age;
        }
    }
    const o1 = new MyClass();
    console.log(o1.age);
    // o1.age('string');

    const descriptor = Object.getOwnPropertyDescriptor(MyClass.prototype, 'age');
    console.log(descriptor);
}

// 10. class中的Generator函数
{
    class MyClass {
        constructor(...args) {
                this.args = args;
            }
            *[Symbol.iterator]() {
                for (const arg of this.args) {
                    yield arg;
                }
            }
    }
    for (const i of new MyClass('hello', 'world', 'i', 'love', 'you')) {
        console.log(i);
    }
    // hello
    // world
    // i
    // love
    // you
}

// 11. class的静态方法
{
    /**
     * 1.方法前加 static，规定此方法不会被类的实例继承(不定义在类的原型对象上)，而是直接通过类来调用
     * 2.静态方法中的this，指向类
     * 3.静态方法可以与非静态方法重名
     * 4.父类的静态方法可以被子类继承
     * 5.在子类中，可以使用 super 调用父类的静态方法
     */
    class Person {
        static liveOn() {
            console.log('earth');
        }
    }
    class Man extends Person {

    }
    Man.liveOn();
    // earth
    console.log(Object.getOwnPropertyNames(Person));
}

// 12. class的静态属性和实例属性
{
    /**
     * 1.静态属性为类本身的属性，而不是定义在实例上的属性
     * 2.ES6明确规定：class内部只能定义静态方法，无法定义静态属性。所以只能在类的外部定义:Foo.prop
     * 3.目前有一个静态属性的提案，规定了实例属性和静态属性的新写法
     */

    //可以通过将属性的取值函数设置为静态方法，变通实现静态属性
    {
        let _cards = [];
        class MyClass {
            static get cards() {
                return _cards;
            }
        }
        MyClass.cards.push(1, 2, 3, 4);
        console.log(MyClass.cards); // [1, 2, 3, 4]
        console.log(Object.getOwnPropertyNames(MyClass));
    }

    // 新的提案：
    {
        // 类的实例属性
        {
            // 使用等式，直接定义在类中
            // class MyClass {
            //     myProp1 = 'myProp1_value';
            //     constructor() {
            //         console.log(this.myProp1);
            //     }
            // }
            // const m = new MyClass();
        }
        // 类的静态属性
        {
            // 属性前加 static
            // class MyClass {
            //     static myProp1 = 'static myProp1_value';
            //     constructor() {
            //         console.log(MyClass.myProp1);
            //     }
            // }
            // const m = new MyClass();
        }
    }

}

// 13. new.target属性
{
    //该属性一般用在构造函数中，返回使用 new 命令创建实例时调用的那个构造函数。如果构造函数不是通过new调用，该属性返回undefined
    class Foo {
        constructor() {
            if (new.target === Foo) {
                throw new Error('Foo 不可以实例化!!');
            }
        }
    }

    try {
        const foo = new Foo();
    } catch (e) {
        console.error(e);
    }
    // Error: Foo 不可以实例化!!

    //子类继承父类时，创建子类的实例，父类constructor()中new.target会返回子类。利用这个特点，可以创建不能独立使用，必须继承后才能使用的类
    class Child extends Foo {
        constructor() {
            super();
            //...
        }
    }
    const child = new Child();

}