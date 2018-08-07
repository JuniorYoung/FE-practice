// 区别于 Set 数据结构：

// 1> WeakSet只能存储引用类型的元素

// 2> WeakSet中的元素都是弱引用

// 3> WeakSet不可遍历

//基本用法
{
    //构造函数可接受任何实现Iterable接口的对象，如数组等，但是数组的所有元素必须是引用类型

    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const arr3=  [5, 6];
    const obj1 = { name: 'Junior' };
    //使用构造函数参数初始化
    const ws = new WeakSet([arr1, arr2]);

    ws.add(arr3);
    ws.add(obj1);

    ws.delete(arr2);

    console.log(ws.has(obj1)); // true

    console.log(ws); // {arr3, arr1, obj1}
}
