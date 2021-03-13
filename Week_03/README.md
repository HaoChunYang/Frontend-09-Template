# 学习笔记-使用 LL 算法构建 AST

## 文件说明

`week03_01.html` 四则运算解析-简分词函数
`week03_02.html` 词法分析-完整版。通过`generator`函数对四则运算进行词法分析。
`week03_03.html` 语法分析。乘法算式的分析。乘分级别最低。
`week03_04.html` 语法分析 2 —— 加法的分析。
`week03_05.html` 语法分析 3 —— 完整四则的分析，总产生式。

## 四则运算

- 词法定义
  `TokenNumber` : . 1 2 3 4....9
  `Operator`: `+ - * /`

- 语法定义

  `LL` : left left
  `LR` : left right

```
产生式
<Expression>::=
  <AdditiveExpression><EOF> // End of files 终结符

<AdditiveWxpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><\*><Number>
  |<MultiplicativeExpression></><Number>
```

## 正则表达式

这里的正则表达式，每一个都有一个圆括号。圆括号表示捕获。专门为谓语词法分析准备的。
用`|`隔开，每匹配到一个就会获到其中一个。

`regexp.exec(source)` 返回匹配到的结果和输入输出等
第 0 个是整个正则匹配到的。从 1 开始，是`|`匹配到的某一种。

## LL 词法分析

`regexp.lastIndex`
`lastIndex` 用于标记由方法 `RegExp.exec()` 和 `RegExp.test()`找到的结果的下次检索的起始点。正则必须使用`g`才能使用.

本节补充逻辑
比较每次正则表达式匹配字符串前行的位数，如果前进的位数 `regexp.lastIndex - lastIndex` 大于 匹配到的结果的长度，说明有不认识的字符(也就是不在我们数组和正则中识别的类型)
不符合的时候就会跳出循环，throw 一个错误。

定义一个 token 对象，存储类型和值。

匹配到一个，可以使用回调函数，也可以使用 javascript 的新语法 `yield` 来吐出一个 token.
改成一个 generator 函数。

```js
function* test () {
  yield ....
}
```

使用时 `for ... of`

```js
for (let token of tokenize("100 * 23 - 1")) {
  console.log(token);
}
```

查找完以后，让得`yield`一个`EOF`.

## LL 语法分析

LL 语法的基本结构，每一个产生式对应着一个函数。

Expression

AdditiveWxpression

MultiplicativeExpression

### 乘法语法分析

乘法级别最低——MultiplicativeExpression()

分三个逻辑

1. 一个数字看作一个特殊的乘法。0 次的乘法

```js
let node = {
  type: "MultiplicativeExpression",
  children: [source[0]],
};
// 一个新的非终结符
```

- 递归结构

2. 以`MultiplicativeExpression`开头，并且跟一个`*`
   应该前三项合成一个新的`MultiplicativeExpression`.
   形成一个新的 node
   再递归一次。
3. 以`MultiplicativeExpression`开头，并且跟一个`/`
   同乘法。为了和产生式一致才进行的折分。
4. 递归终止的条件

```js
// 递归终止的条件,以 MultiplicativeExpression 开头，并不以* / 结束
if (source[0].type === "MultiplicativeExpression") {
  return source[0];
}
```

### 加法语法分析

AdditiveWxpression()

- 加法的逻辑比较复杂。除了乘法的那三种外重要的一点，在刚一进入函数时，要先处理`MultiplicativeExpression`的所有逻辑。
- `AdditiveWxpression`的所有逻辑，包含了所有的`MultiplicativeExpression`逻辑。
- 当找到一个不认识的东西的时候(比如 Number)，调一次`MultiplicativeExpression`再重新调用`AdditiveWxpression`
- 另一个复杂的点：
  对应的产生式：`<AdditiveExpression><+><MultiplicativeExpression>`
  在处理第三项的时候，它是一个非终结符。
  要额外的调用一次`MultiplicativeExpression`，把 source 里面的非终结符给处理掉。
  ```js
  node.children.push(source.shift());
  node.children.push(source.shift());
  MultiplicativeExpression(source);
  node.children.push(source.shift());
  ```
- 一个单独的乘法（MultiplicativeExpression），是一个特殊的加法，可以看作 0 次的加法。

### 完整的语法分析

```js
function Expression(source) {
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "EOF"
  ) {
    let node = {
      type: "Expression",
      children: [source.shift(), source.shift()],
    };
    source.unshift(node);
    return node; // !!!注意，这里是return node!!!
  }
  AdditiveExpression(source);
  return Expression(source);
}
```

**注意** 这里的`return node`, 对啊，我们要的就是一个这样的对象。
