# 学习笔记-使用 LL 算法构建 AST

## 文件说明

`week03_01.html` 四则运算解析-简分词函数

## 四则运算

- 词法定义
  `TokenNumber` : . 1 2 3 4....9
  `Oper

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
