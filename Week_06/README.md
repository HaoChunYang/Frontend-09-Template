# 学习笔记- 重学JavaScript 一

## JavaScript语言通识

学了计算机语言这么久，用了计算机语言这么久，从来没有细细的像`winter`老师这样对语言重新思考过。以前偶尔了解一点理论的内容，感觉就可以装逼了。但是像`winter`老师这样体系化以后，感觉，那是真牛13.

### 泛用语言分类方法

- 非形式语言：英文、中文
- 形式语言：**乔姆斯基谱系**
    - 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
    - 1- 型文法（上下文相关文法）生成上下文相关语言。
    - 2- 型文法（上下文无关文法）生成上下文无关语言。
    - 3- 型文法（正则文法）生成正则语言。
        —— 所有能够被正则表达式直接去描述的一种文法。

    **4 种文法是一种上下包含的关系。上 包括 下。自上包含向下。**

### 什么是产生式

一个牛B的工具：`产生式`(`BNF`巴科斯范式)

> 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句

> 巴科斯诺尔范式：即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。

> 终结符： 最终在代码中出现的字符（ https://zh.wikipedia.org/wiki/ 終結符與非終結符)

- 用尖括号括起来的名称表示语法结构名

- 语法结构分成基础和需要用其他语法结构定义的复合结构

    - 基础结构称终结符
    - 复合结构称非终结符

- 引号和中间的字符表示终结符

- 可以有括号

- `*` 表示重复多次

- `|` 表示或

- `+` 表示至少重复一次

四则运算的产生式表示（参看：前几周中编程训练产生式）

**练习** 编写带括号的四则运算产生式。

```js
<Expression>::=
  <AdditiveExpression><EOF> // End of files 终结符

<AdditiveWxpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <BracketExpression>
  |<MultiplicativeExpression><\*><BracketExpression>
  |<MultiplicativeExpression></><BracketExpression>

<BracketExpression>::=
    <Number>
    |"("<AddtiveExpression>")"
```

### 深入理解产生式

通过产生式理解乔姆斯基谱系

- 0型 无限制文法 `?::=?`
- 1型 上下文相关文法 `?< A >?::=?< B >?`
- 2型 上下文无关文法 `< A > ::=?`
- 3型 正则文法 `< A >::=< A >?`

** 乘方运算符。右结合。所以它不是一个正则文法。

JS 也不是一个严格的上下文无关文法。

### 现代语言的分类

- 现代语言的特例。

    - `c++`中，* 可能表示乘号或者指针，具体指哪个，取决于当前位置的标识符是否被声明为类型
    - `VB`中，`<`可能是小于号，也可能是XML直接量的开始，取决于当前位置时否可以接受XML直接量
    - `Python`中行首的tab符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent
    - `JavaScript`中，/ 可能是除号，也可能是正则表达式的开头，处理方式类似于VB，字符串模板中也需要特殊处理 `}` ，还有自动插入分号规则

- 形式语言的分类

    - 按照用途来分类：

    类别|例子    
    ----|----
    数据描述语言 | JSON，HTML，XAML，SQL，CSS
    编程语言 | C，C++，Java，C#，Python，Ruby，Perl，Lisp，T-SQL，Clojure，Haskell，JavaScript
    
    - 按表达方式分类：

    类别|例子
    ---|---
    声明式语言 |JSON，HTML，XAML，SQL，CSS，Lisp，Clojure，Haskell
    命令式语言 |C，C++，Java，C#，Python，Ruby，Perl，JavaScript

**练习** 尽可能的寻找你知道的计算机语言，尝试把他们分类。

用途分类|-
----|----
数据描述语言| html, css, scss, less, json, xml
编程语言| C，C++，Java，C#，Python, js, php


### 编程语言的性质

> 图灵完备性：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。

> 图灵机（Turing machine）：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。

> 静态和动态语言： https://www.cnblogs.com/raind/p/8551791.html
> 
> 强类型： 无隐式转换
> 
> 弱类型： 有隐式转换
>
> 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html

- 图灵完备性
    - 命令式——图灵机

        - goto
        - if和while

    - 声明式——lambda
        - 递归

- 动态与静态
    - 动态
        - 在用户的设备/在线服务器上
        - 时机：产品实际运行时
        - 术语：Runtime
    - 静态
        - 在程序员的设备上
        - 时机：产品开发时
        - 术语：Compiletime

- 类型系统
    - 动态类型系统与静态类型系统
    - 强类型与弱类型
    - 复合类型
        - 结构体
        - 函数签名
    - 子类型
    - 泛型
        - 逆变/协变

### 一般命令式编程语言的设计方式

## JS类型

### Number 类型

### String 类型

**练习** 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码。
```
```

### 其他类型

## JS对象

### 对象的基础知识

**练习：** 用 JavaScript 去设计狗咬人的代码

### JS中的对象

**作业** 找出 JavaScript 标准里面所有具有特殊行为的对象