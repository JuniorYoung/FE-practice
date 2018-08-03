// codePointAt()

// String.fromCodePoint()

// at()

// normalize()

// padStart() padEnd()
{
    let str = 'foo';
    for(s of str) {
        console.log(s);
    }
    //f
    //o
    //o
}
{
    let str = 'hello'
    console.log(str.startsWith('he')); //true
    console.log(str.endsWith('lo')); //true
    console.log(str.includes('el')); //true

    console.log(str.endsWith('h', 1)); //true
}
{
    let str = 'hello';
    console.log(str.repeat(3)); // hellohellohello
}
{
    //模板字符串
    let str = 'world';
    let strTemp = `hello, 
    ${str}`;
    console.log(strTemp);

    let fn = () => 'hello world';
    console.log(`call func: ${fn()}`);
}