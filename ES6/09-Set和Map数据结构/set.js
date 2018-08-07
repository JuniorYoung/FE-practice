// Set 基本用法
{
    const s = new Set();
    [1, 2, 3, 2, 5, 1].forEach( x => s.add(x));
    for(let i of s) {
        console.log(i);
    }
    // 1
    // 2
    // 3
    // 5

    // Set 函数可接受一个实现Iterator接口的数据结构（如数组等）的参数

    //去除数组重复元素
    const arr = [1, 1, 2, 2, 3];
    //第一种方法
    const s1 = new Set(arr);
    console.log([...s1]); // [1, 2, 3]
    //第二种方法
    console.log(Array.from(s1)); // [1, 2, 3]

    // 多个NaN只添加一次
    const s2 = new Set();
    const a = NaN;
    const b = NaN;
    s2.add(a);
    s2.add(b);
    console.log(s2.size); // 1
}
//Set 实例 操作数据的方法
{
    const s = new Set();

    //add() 添加一项并返回Set结构本身
    s.add(1);
    s.add(2);
    
    //delete() 删除一项 并返回表示是否删除成功的布尔值
    const isDel = s.delete(1);
    console.log(isDel); // true
    
    //has() 验证该值是否Set的成员
    console.log(s.has(2)); // true
    
    //clear() 清除所有成员
    s.add(3);
    console.log(s.size); // 2
    s.clear();
    console.log(s.size); // 0

}
//Set 实例 遍历成员的方法
{
    //keys() 返回键名的迭代器
    //values() 返回键值的迭代器

    // Set结构没有键名 所以keys()和values()的行为相同
    const s = new Set(['green', 'red', 'blue']);
    //Set实例默认可遍历
    console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true
    for(let i of s.values()) { // 等同于 for(let i of s)
        console.log(i);
    }
    // green
    // red
    // blue

    //entries() 返回键值对的迭代器
    for(let i of s.entries()) {
        // debugger;
        console.log(i);
    }
    // ['green', 'green']
    // ['red', 'red']
    // ['blue', 'blue']

    //forEach() 接收一个回调函数 遍历所有成员
    s.forEach((value, key, thisSet) => {
        console.log(value, key, thisSet);
    });
}
//遍历的应用
{
    // 数组去重
    
    //实现并集、交集、差集
    {
        const arr1 = [1, 2, 3, 4];
        const arr2 = [2, 4, 5];
        const arr3 = [1, 2, 4, 5];

        //并集
        function union() {
            let param = Array.from(arguments);
            return param.reduce((prev, cur) => {
                return new Set([...prev, ...cur]);
            });
        }
        const unionRes = union(arr1, arr2, arr3);
        console.log(unionRes); // {1, 2, 3, 4, 5}
        
        //交集
        function intersect() {
            let param = Array.from(arguments);
            return param.reduce((prev, cur)  => {
                return new Set(
                    [...cur].filter(
                        x => 'has' in prev ? prev.has(x) : prev.includes(x)
                    )
                );
            });
        }
        const intersectRes = intersect(arr1, arr2, arr3);
        console.log(intersectRes); // {2, 4}

        //差集
        function difference() {
            let param = Array.from(arguments);
            return param.reduce((prev, cur) => {
                return new Set(
                    [...prev].filter(
                        x => 'has' in cur ? !cur.has(x) : !cur.includes(x)
                    )
                );
            });
        }
        const diffRes = difference(arr1, arr2, arr3);
        console.log(diffRes); // {3}
    }

    //遍历元素时修改原集合的数据
    //第一种方法
    let set = new Set([1, 2, 3]);
    set = new Set([...set].map(x => x * 2));
    console.log(set); // {2, 4, 6}
    //第二种方法
    set = new Set(Array.from(set, x => x * 2));
    console.log(set); // {4, 8, 12}
}