// 提供二进制和八进制数值的新写法
{
    // 二进制 前缀 0b / 0B
    console.log(0b111110111 === 503); // true
    // 八进制 前缀 0o / 0O
    console.log(0o767 === 503); // true

    console.log(Number(0b101101)); // 45
}

// 扩展 Number对象
{
    // 1. 新增：Number.isNaN() 和 Number.isFinite()
    {
         // 与全局的 isFinite() isNaN() 的区别：全局的对于非数值的值，先调用Number()转换再判断；新增的只对数值有效，对于非数值不会调用Number()转换
        console.log('Number.isNaN()');
        // Number.isFinite() 检测一个数值是否是有限的，即非Infinity
        console.log(Number.isFinite(Infinity)); // false
        console.log(Number.isFinite(-Infinity)); // false
        console.log(Number.isFinite(100)); // true
        // Number.isNaN()
        console.log(Number.isNaN(NaN)); // true
    }

    // 2. 新增：Number.parseInt() 和 Number.parseFloat()， 方法的行为与全局的 parseInt() 和 parseFloat()完全相同

    // 3. 新增：Number.isInteger()
    {
        console.log('Number.isInteger(): ');
        // 判断一个数值是否为整数
        console.log(Number.isInteger(11)); // true
        console.log(Number.isInteger(11.11)); // false
        console.log(Number.isInteger(11.0)); // true
    
        // 对于非数值，不会调用Number()转换再判断
        console.log(Number.isInteger(true)); // false
        console.log(Number.isInteger('true')); // false
    }

    // 4. 新增：Number.EPSILON

    // 5. 新增：Number.isSafeInteger()
    {
        console.log('Number.isSafeInteger(): ');
        // JS能表示的整数范围在 -2^53 至 2^53之间（不包括两个端点）
        console.log(Math.pow(2, 53) === (Math.pow(2, 53) + 1)); // true

        // Number.MAX_SAFE_INTEGER  Number.MIN_SAFE_INTEGER
        console.log(Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1); // true
        console.log(Number.MIN_SAFE_INTEGER === Math.pow(-2, 53) + 1); // true

        // Number.isSafeInteger() 判断一个整数是否在有效的整数范围内
        console.log(Number.isSafeInteger(Math.pow(2, 53))); // false
        console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
    }
}

// 扩展 Math对象
{
    // 1. Math.trunc()
    {
        // 去除一个数值的小数部分，返回整数部分
        console.log(Math.trunc(1.11)); // 1
        console.log(Math.trunc(-0.11)); // -0

        // 非数值，先调用Number()转换
        console.log(Math.trunc('11.11')); // 11
        console.log(Math.trunc(true)); // 1
        console.log(Math.trunc(null)); // 0

        // 
        console.log(Math.trunc(undefined)); // NaN
        console.log(Math.trunc('foo')); // NaN
    }

    // 2. Math.sign()
    {
        // 判断一个数值是正数、负数、or 0， 对于非数值，先Number()转换
        // 正数： +1
        // 负数： -1
        // 0： 0
        // -0： -0
        // 其他值：NaN
        console.log(Math.sign(10)); // 1
        console.log(Math.sign(-10)); // -1
        console.log(Math.sign(0)); // 0
        console.log(Math.sign(-0)); // -0
        console.log(Math.sign('foo')); // NaN
        console.log(Math.sign(undefined)); // NaN
        console.log(Math.sign(+true)); // 1
    }

    // 3. Math.cbrt()
    {
        // 计算一个数的立方根，对于非数值，先Number()转换
        console.log(Math.cbrt(27)); // 3
        console.log(Math.cbrt(8)); // 2
    }

    // 4. Math.clz32()

    // 5. Math.imul()
    
    // 6. Math.fround()

    // 7. Math.hypot()

    // 与对数相关的方法：
    // 8. Math.expm1()

    // 9. Math.log1p()

    // 10. Math.log10()

    // 11. Math.log2()
    
    // 与双曲函数相关的方法：
    // 12 .Math.sinh()

    // 13. Math.cosh()

    // 14. Math.tanh()

    // 15. Math.asinh()

    // 16. Math.acosh()

    // 17. Math.atanh()

}

// 指数运算符
{
    console.log(2 ** 2); // 4
    console.log(3 ** 2); // 9

    // 与 = 结合  **=
    let a = 10;
    console.log(a **= 3); // 1000
}