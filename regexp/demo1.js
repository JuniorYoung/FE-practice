const text = 'A quick fox';

// .
const point_str = 'abc.com.cn';
const point_regexp = new RegExp('.om');
// com
console.log('匹配 .', point_str.match(point_regexp));

// \b
const b_str = 'moon';
const b_regexp = new RegExp('\\bm');
const b_regexp_2 = /oon\b/;
// ['m'], ['oon']
console.log('匹配 \\b', b_str.match(b_regexp), b_str.match(b_regexp_2));
// \B
const B_regexp = /oo\B/;
// ['o']
console.log('匹配 \\B', b_str.match(B_regexp));

// \s
const s_str = 'foo bar';
const s_regexp = /\s\w*/;
// [' bar']
console.log('匹配 \\s', s_str.match(s_regexp));

// \w 与 \W
const w_str = '&yang_100%';
const w_regexp = /\w/;
const W_regexp = /\W/;
console.log('匹配 \\w', w_str.match(w_regexp), w_str.match(W_regexp));

// 重复限定符
const xing_str = 'gooooogle';
const xing_regexp = /go*/;
const xing_regexp_2 = /go{0,}/;
console.log('匹配 *', xing_str.match(xing_regexp), xing_str.match(xing_regexp_2));
const jia_regexp = /go+/;
console.log('匹配 +', xing_str.match(jia_regexp));
const wen_regexp = /go?/;
console.log('匹配 ?', xing_str.match(wen_regexp));

const regexpLastWord = /\w+$/;
console.log(text.match(regexpLastWord));
// expected output: Array ["fox"]

const regexpWords = /\b\w+\b/g;
console.log(text.match(regexpWords));
// expected output: Array ["A", "quick", "fox"]

const regexpFoxQuality = /\w+(?= fox)/;
console.log(text.match(regexpFoxQuality));
// expected output: Array ["quick"]
