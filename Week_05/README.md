# 学习笔记 ---- proxy与双向绑定

## 文件说明

`week05_01.html` proxy的基本用法

`week05_02.html` reactive的最简版。一

`week05_03.html` effect函数的使用一

`week05_04.html` effect与reactive建立连接

`week05_05.html` 优化reactive. 监听 po.a.b

`week05_06.html` 响应式对象。增加一个 input .--> 色板

`week05_07.html` 一个正常的拖拽。

`week05_08.html` 正常流里的拖拽

## proxy的基本用法

不建议在业务中大量使用 `proxy`. `winter`说`proxy`的设计是一种强大且危险的设计。&#x1F601;

应用`proxy`的代码，它的预期性会变差。它的设计是专为底层库来设计的一种特性。

我们正常声明一个`objedct`时，是如下这个样子。
```js
  let object = {
    a: 1,
    b: 2
  }
```
- 当我们访问a 和 b 属性时，它是一个写死的过程。无法在中间加入任何监听的代码。这个`object`它是一个不可`observe`的一个对象。只是一个单纯的数据存储。（底层机制，无法改变）

想，设置一个对象，既像普通对象能存储，又想能够监听。`proxy`闪亮登场。用`proxy`包裹一层`object`.

```js
  let po = new Proxy(object, {
    set (obj, prop, val) { // 三个参数：对象、属性、属性值
      console.log(obj, prop, val)
    }
  })
```
- 第一个参数，将`object`传入。第二个参数是`config`对象。即我们要对 po 这个对象做的钩子。

- 例子中设置一个`set`属性的钩子。当我们`set`属性值的时候，就会被触发。例如：`po.a = 3`

- 即使我们设置一个没有的属性也会默认触发`set`钩子函数。例如：`po.x = 5`

- 很多内置的或原生的函数都有提供钩子函数。可以查看 MDN

- 设置原始对象的值时，并不会触发 proxy 上的 hook 函数。

- 可以理解 po 是一个特殊的对象，它上面的很多行为都是可以被再次制定的。

## 模仿reactive实现原理

模仿 vue3.0 的 reactive 的模型，理解它的实现原理。

一般 proxy 的使用，不用直接去 new 一个 Proxy 对象。而且去封装到一个函数里。类似 Promise

```js
  function reactive () {
    // 一般 proxy 的使用，不用直接去 new 一个 Proxy 对象。而且去封装到一个函数里。类似 Promise
    return new Proxy(object, {
      set (obj, prop, val) {
        obj[prop] = val // 如果不设置的话，原 object 的值，是不会发生变化的。
        console.log(obj, prop, val)
        return obj[prop] // 这个地方好像不写 return 也可以。老师写了。
      },
      get (obj, prop) {
        console.log(obj, prop)
        return obj[prop]
      }
    })
  }
```

如何去监听呢？考虑给 po 加一个`addEventListener`类似这样的函数。

vue 中使用`effect`函数，传一个函数进去，可以直接监听 po 上面的一个属性。以此来代替事件监听的机制。查看代码：[`week05_03.html`](./week05_03.html)

### 将`reactive` 和 `effect` 之间建立连接。

在JS中我们没有任何办法，获取一个函数它能够访问到的所有变量。实际即使能够知道它访问到哪些变量，也没有任何的数据结构能够去表示它。

**我们虽然没有办法去获取一个函数里面引用了哪些变量，但是我们有办法去调用一个这个函数，看它实际用了哪些变量。如果引了一个普通的变量，我们也没有办法去监听它，如果它引了一个`reactive`，我们就可以在`reactive`的`get`里面去获取一个这样的监听效果。**

尝试在`effect`函数里面，把这个函数调用了 object 的哪些属性给它取出来。

步骤：

1. 定义一个全局变量`usedReactivties`
2. 尝试在`effect`里面去调用一次`effect`函数。
3. 在`reactive`的`get`函数里，把它注册进`usedReactivties`里面。

执行完之后，就知道它用了哪些变量了。

**注意** 
1. 只是在 get 函数里面进行了注册。所以如果需要监听，需要先调用get方法。 
2. 还要调用`effect`，设置对应的`callback`函数。

详见代码[`week05_04.html`](./week05_04.html)

该版代码未考虑解除的效果。
## 优化reactive

监听 po.a.b 层次数据。
```js
  let object = {
    a: {
      b: 1
    },
    b: 2
  } // 普通对象
```

- 重点改造部分

```js
  function reactive (object) {
    // 2. 如果已经有 reactivity ,直接返回
    if (reactivities.has(object)) {
      return reactivities.get(object)
    }

    // 3. 取完后，要保存
    let proxy = new Proxy(object, {
      set (obj, prop, val) {
        obj[prop] = val 
        if (callbacks.get(obj)) {
          if (callbacks.get(obj).get(prop)) {
            for (let callback of callbacks.get(obj).get(prop)) {
              callback()
            }
          }
        }
        return obj[prop]
      },
      get (obj, prop) {
        usedReactivties.push([obj, prop])
        // 1. 如果想要监听 po.a.b 的话，要在这时套一层
        if (typeof obj[prop] === 'object') {
          return reactive(obj[prop])
        }
        return obj[prop]
      }
    })

    // 4. 保存
    reactivities.set(object, proxy)
    
    return proxy
  }
```

详见代码[`week05_05.html`](./week05_05.html)

*参考 vue 源代码去学习真正的 reactivity 库吧。*

## reactive响应式对象

reactivity 是一个半成品的双向绑定。负责从数据到 DOM 元素(任何的native的输入)的监听。

从 DOM 元素到数据的监听
```js
  effect(() => {
    document.getElementById('r').value = po.r
  })
```
再加一行代码，就能实现双向绑定
```js
document.getElementById('r').addEventListener('input', (event) => {
    po.r = event.target.value
  })
```

- 调色板案例，MVVM 经典案例。

记得加一个总的`effect()`
```js
  effect(() => {
    document.getElementById('color').style.backgroundColor = `rgb(${po.r}, ${po.g}, ${po.b})`
  })
```

响应式。最大程度的减少代码量。甚至可以 0 代码的实现调色板。666

# 学习笔记 ---- 使用Range实现DOM精准操作

## 基本拖拽

系统的 dragdrop 事件不是我们想要的。

需求：完全跟随着鼠标移动。使用 dragdrop 做不到。

需要使用 `mousedown`、`mousemove`、`mouseup`组合模拟。

事件监听注意事项：

鼠标按下去之后(`mousedown`)，再监听`mousemove`和`mouseup`才能在性能和逻辑上正确。

`mousemove`和`mouseup`要在 document 上监听。

`mouseup`时要将另外两个事件给`move`掉。

逻辑框架代码：
```js
  dragable.addEventListener('mousedown', function (event) {

    let up = (event) => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    let move = (event) => {
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  })
```

JS中，函数是一等公民. :smile:


## 正常流里的拖拽

文字没有分节点。所以必须通过`Range`找到能拖拽的空位。——>建一张 Range 的表。把能插的所有空隙列出来。


- ranges 表，知道各个字的起始位置。但不知道位置。
- `CSSOM API`

  `getBoundingClientRect()`
  求出每个文字的位置。
```js
let rect = range.getBoundingClientRect()
```

- `insertNode()`等所有的 DOM 操作，都会默认的把原来已在 DOM 树上的元素给移除掉的。

- 解除选中事件
```js
  document.addEventListener('selectstart', event => event.preventDefault())
```