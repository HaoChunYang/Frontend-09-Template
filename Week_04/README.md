# 学习笔记 -- 字符串分析算法

## 文件说明

`week04_01.html` 字典树练习

`week04_02.html` KMP算法练习

`week04_03.html` wildcard算法练习

## 总论

### 字符串算法整体目录

从简单到难顺序

- 字典树

    大量高重复字符串的存储与分析，精确匹配。
    
    如1亿字符串大约频率出现前50的字符串是什么。eg:搜索关键词。
- KMP
    
    在长字符串里找模式。
    
    不是完整的字符串匹配。检查长字符串中有没有短字符串的部分的。
    
    **区别字典树**：字典树是检查两个字符串完全匹配。KMP，检查一个字符串是另一个字符串的部分。

    KMP复杂度`O(m+n)`
- Wildcard

    带通配符的字符串模式

    在KMP的基础上，加了通配符。？*

    `?`：表示匹配任意字符

    `*`：表示匹配任意数量的任意字符

    如：文件查找.
    也是弱一点的正则。

    也可以在O(n)的时间复杂度内处理
- 正则

    字符串通用模式匹配。

    需求用到回溯。字符串匹配的终极版本

- 状态机

    通用的字符串分析

    比正则更强大。完全状态机等价于正则
- LL LR

    字符串多层级结构分析。
    
    LR比LL更强大？咋分的？LR(1) 等同于LL(n)的运算。

## 字典树

想一下平时查字典时，字典里面单词的排序。

代码实现逻辑：
    
    用一个空的对象保存字典树里的值。也可以用Map作为根结点。
    最适合保存存字典树数据结构的分支。
    此处字典里只会存字符串，所以这里用对象和Map没有本质区别。

为了干净，用`Object.create(null)`来创建字符串，避免受到`Object.prototype`上面的原型上面的污染。
实际上每次存的是一个字符，也不会存在污染。尽量干浄。

    ab 和 abc 不同，所以我们在ab后面加一个截止符 $。
我们用`let $ = Symbol('$')`来处理字符串中本来带有`$`字符串的问题。利用了`Symbol`的不可重复的特点。

```js
    // 随机字符串函数
    function randomWord (length) {
      let s = ''
      for (let i = 0; i < length; i++) {
        s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
      }
      return s
    }
```

```js
// 随机插入10万个字符串
    let trie = new Trie()

    // 插入10万个随机字符
    for (let i = 0; i < 100000; i++) {
      trie.insert(randomWord(4))
    }
```
- 如果想找到出现次数最多的字符串，增加一个`most()`方法。去遍历整个数组。

    这里用到一个递归函数。

    我们还可以找到字典树最小，字典树最大。

    对数字进行补位处理。如`0001`，那么对1万以内的数字求最大，求最小，都很好做。无论数字有多少个。


        字典树处理大量数字和字符串的能力。是一种特例哈希树。哈希树在字符串领域最直接的应用就是字典树。

## KMP字符串模式匹配算法

模式匹配算法：在一个字符串里查找有没有另一个字符串。

    待查串：长串 source串
    原串：短串 pattern串

- Brute-Force (BF)

    暴力解。从长串的每一个节点（每一个位置）开始，去匹配`pattern`串。时间复杂度`m * n`

- KMP (三位计算机专家。K 高德纳)

例子：

    pattern: abcdabce
                    j
    source:  abceabcdabcex
                    i

查到最后e的时候，发现和d匹配不上。但是自身是有重复的。在该例中重复的abc。

匹配不上时，不需要回到最前面。回到第一个`d`就可以继续进行匹配。

**关键点：** 关注字符串`pattern`串的自重复行为。找到那个重复的`abc`.

**方法：** 将`pattern`串遂位截短。然后再看它们有没有公共的最长的前面的子串。

**描述这种自重复的行为**
创建一个和`pattern`串长度一样的数组，分别填上到此字符的时候已经有几个字母是重复的了。为了回退时找到位置。

**步骤**

第一步：求跳转表格。
```js
{
// 查字符串中有没有自重要
let i = 1 // i 要从 1 开始。从 0 开始的话，整个串都是重复的。我理解也就是单个字串的重复进行计算，是没有意义的。
let j = 0 // 已重复的字符个数

// 写一个循环，从 i 开始计算重复的数字。
while (i < pattern.length) {
  if (pattern[i] === pattern[j]) { // 匹配上的情况
    ++j, ++i;
    table[i] = j
  } else { // 不匹配的时候
    if (j > 0) { // aabaaac 这种情况。最后一个a
      j = table[j]
    } else {
      ++i;
    }
  }
}
console.log(table)
// 对应的数组是，前面字符串匹配上的字符串的个数。
}
```

**纠正思考：** 对应数组的值，是前面的字符串有几个发生重复的(长度)。
如`abababc`的结果是`0 0 0 1 2 3 4`,最后一位的4，是前面有`abab`4个长度的字符重复。即第2-5位的`abab`与第0-3位的`abab`重复。

第二步：进行真正的匹配。
```js
// 匹配
{
  let i = j = 0; 
  // j 认为是 pattern 串的起始位置
  // i 认为是 source 串的超始位置

  while (i < source.length) {
    // 匹配上的情况
    if (pattern[j] === source[i]) {
      ++i, ++j; // 自增，前进一格
    } else { // 没有匹配上
      if (j > 0) {
        j = table[j]
      } else { // 当 j = 0 时，source继续进一格
        ++i;
      }
    }
    // 结束的条件.
    if (j === pattern.length) { // 自增之后的 j,当匹配到 pattern 尾部时
      return true
    } // 进一步优化，计算出匹配到的位置

  }
  return false // 当 source 串到头没有匹配到
}
```

**注意** 结束的条件的判断。如果写在开头，判断不了pattern串完全在source串尾部的情况。如两个相等的字符串。

**优化** 计算出匹配到字符串的位置。

**关联** `LeetCode` 28 题。标准的KMP问题。

## Wildcard

是一个比字典树和KMP较为复杂的情况。因为加入了两种通配符。`?` `*`

    wildcard: ab*c?d*abc*a?d
    只有 * ：ab*cd*abc*a?d
    只有 ? : ab?d?ab?c

- 思考：`*`应该尽量匹配的多还是尽量匹配的少呢？

    最后一个`*`和前面的星号是不一样的。最后一个尽量的匹配到更多的字符。之前的所有星号`*`可以尽量的匹配少的字符。

    如例子中`ab*cd*abc*a?d` ,开头的`ab`和结尾的`a?d`是只匹配开头和结尾的几个字符的。中间部分，可以划分为一个`*`加上一段字符作为**一组**

    - **一组** 就是在我们的字符串里面找一个特定的`pattern`字符串。如：`*cd`就是在字符串里面找`cd`这个字符。——哈哈，`KMP`来了。

    - 那么，如果不考虑`?`,一个`wildcard`就是由若干个`KMP`组成的一个格式。

    - 如果带上问号，就是一个带问号的KMP算法。一个偷懒的应用，可以使用正则`exec`来处理带问号的部分。
    
    - 如果把整个wildcard字符串整个的转化为正则，它的性能一定是**不合格**的。但是逐段的转换成`exec`来处理正则部分，它的性能就没有太大的问题。

### `wildcard`代码逻辑

- 要想知道最后一个星号，需要扫描一遍。从头到尾的寻找有多少个星号。
```js
let starCount = 0
for (let i = 0; i < pattern.length; i++) {
  if (pattern[i] === '*') {
    starCount++
  }
}
```

正则表达式里面的任意符号的表示`[\\s\\S]` ，小s 和大S 互补的，加在一块就是整个字符集。

正则的lastIndex属性，改为我们的lastIndex值，就是以接着去找。相当于正则查找的起始位置。

- 打断点是一个非常好的调试方法。

- `reg.exec(source)`执行一次会发生一次匹配起始位置的移动。


===
这部分逻辑还要再消化一下。