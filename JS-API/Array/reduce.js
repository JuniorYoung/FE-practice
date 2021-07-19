const fs = require('fs');

/*
{
    'Mike John': [
        {
            'name': 'xxx',
            'price': 'xxx',
            'quantity': 'xxx'
        }
    ],
    'Adidas': [
        {
            'name': 'xxx',
            'price': 'xxx',
            'quantity': 'xxx'
        }
    ]
}
*/

const output = fs.readFileSync('./data.txt', { encoding: 'utf8' })
    .trim()
    .replace(/\r/g, '')
    .split('\n')
    .map(i => i.split('\t'))
    .reduce((prev, curr) => {
        console.log(curr);
        prev[curr[0]] = prev[curr[0]] || [];
        prev[curr[0]].push({
            name: curr[1],
            price: curr[2],
            quantity: curr[3],
        });
        return prev;
    }, {});

console.log('output', JSON.stringify(output, null, 2));