// 1. extends
{
    /**
     * 1.使用 extends 关键字实现继承关系
     * 2.子类的constructor()中，第一行代码必须是 super()（子类没有定义constructor()时，会默认添加）。先调用父类的构造函数之后，才能使用this，否则报错。
     * 3.子类会继承父类所有的方法和属性（包括静态方法、静态属性、实例方法、实例属性）
     */
    class Point {

    }

    class ColorPoint extends Point {
        constructor() {
            super();
        }
    }
    console.log(Object.getPrototypeOf(ColorPoint) === Point);
    // true
}

// 2. super
{
    // super 关键字可以当做对象或函数使用

    // 作为函数时，代表父类的构造函数，只能在子类的构造函数中使用
    {
        class A {
            constructor() {
                console.log(new.target.name);
            }
        }
        class B extends A {
            constructor() {
                super();
            }
        }
        new A(); // A
        new B(); // B ，new.target指向创建实例时调用的构造函数，说明super()内部的this指向B的实例
    }

    // 作为对象时
    {
        /**
         * 1.在子类的普通方法和构造函数中指向父类的原型对象，在静态方法中指向父类
         * 2.在子类普通方法中使用super调用父类的方法时，父类方法中的this指向子类的实例
         * 3.在子类静态方法中使用super调用父类的静态方法时，父类方法中的this指向当前子类 
         * 4.如果通过super对属性赋值，这时相当于使用this对当前实例的属性赋值
         * 5.super不但可以在class代码块中使用，也可以直接在对象中使用（由于对象总是继承自Object）
         * 6.无法通过super获取父类的实例属性和实例方法
         */
        class A {
            constructor() {
                this.pa = 'A\'s instance';
            }
            print() {
                console.log(this.pa);
            }
            static getStatus() {
                return this.STATUS;
            }
        }
        A.STATUS = 'A is ok';

        class B extends A {
            constructor() {
                super();
                this.pa = 'B\'s instance';
            }
            static getAStatus() {
                return super.STATUS;
            }
        }
        B.STATUS = 'B is ok';

        const a = new A();
        const b = new B();
        // B's instance
        console.log(B.getStatus());
        // B is ok
        b.print();
        // B's instance
        console.log(B.getAStatus());
        // A is ok
    }
}

// 3. 类的prototype属性和__proto__属性
{

    /**
     * 1.子类的__proto__属性，表示构造函数的继承，总是指向父类
     * 2.子类prototype的__proto__属性，表示方法的继承，指向父类的prototype属性
     */

    class A {

    }
    class B extends A {

    }
    console.log(B.__proto__ === A); // true
    console.log(B.prototype.__proto__ === A.prototype); // true

    // 实例的__proto__属性
    const a = new A();
    const b = new B();

    console.log(b.__proto__.__proto__ === a.__proto__); // true
    b.__proto__.__proto__.print = function () {
        console.log('edit by child');
    };
    a.print();
    // edit by child

    // 以下代码模拟实现类的继承
    {
        class C {}
        class D {}

        Object.setPrototypeOf(D, C);
        Object.setPrototypeOf(D.prototype, C.prototype);

        console.log(D.__proto__ === C); // true
        console.log(D.prototype.__proto__ === C.prototype); // true
    }
}

// 4. 继承原生构造函数
{
    // 目前ECMAScript内置的原生构造函数：Boolean、String、Number、Date、Array、Function、Error、RegExp、Object

    // 在ES5中，以上原生的构造函数无法被继承。

    // 自定义数组的子类
    {
        // ES5：
        {
            let MyArray = function () {
                Array.apply(this, arguments);
            }
            MyArray.prototype = Object.create(Array.prototype, {
                constructor: {
                    value: MyArray,
                    writable: true,
                    configurable: true,
                    enumerable: true
                }
            });
            let nums = new MyArray();
            nums[0] = 1;
            nums[1] = 2;
            console.log(nums.length); // 0
        }
        // ES6：
        {
            class MyArray extends Array {
                constructor() {
                    super();
                    this[0] = '初始化第一个元素的值';
                }
            }
            const nums = new MyArray();
            console.log(nums.length); // 1
        }
    }
}

// 5. 