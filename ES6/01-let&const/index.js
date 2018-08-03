//let const 练习
{
    if (true) {
        var a = 1;
        let b = 2;
    }
    console.log('a: ' + a); // a: 1
    try {
        console.log(b);
    } catch (error) {
        console.error(error); // ReferenceError: b is not defined
    } 
}

{
    var ia = [];
    for (let j = 0; j < 10; j++) {
        ia[j] = function () {
            console.log(j);
        };
    }
    ia[6](); // 6
    try {
        console.log(j);
    } catch (error) {
        console.error(error); // ReferenceError: j is not defined
    } 
}

{
    // TDZ temporal dead zone
    try {
        var tmp = 123;
        if (true) {
            tmp = 'abc';
            let tmp;
        }
    } catch (error) {
        console.error(error); // ReferenceError: tmp is not defined
    }
}

