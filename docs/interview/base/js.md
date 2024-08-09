# JS

## ES6 语法

1. let const
2. 展开运算符
3. Promise
4. 解构赋值
5. map filter some every reduce find
6. 箭头函数
7. 模版字符串
8. Class

[大佬整理过的](https://fangyinghang.com/es-6-tutorials/)

## Promise 合集

## 防抖和节流

1. 防抖：一段时间后才调用，适用频繁触发场景，只求最后一次结果，如 input 输入，窗口 resize 等

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    const that = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
```

2. 节流：一段时间内只调用一次，适用限制事件处理频率，持续的寻求结果，如滚动，按钮点击

```js
function throttle(fn, delay) {
  let timer;
  return function (...args) {
    const that = this;
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(that, args);
      timer = null;
    });
  };
}
```

## 手写 AJAX

```js
const ajax = new XMLHttpRequest();
request.open("GET", "/a/b/c?name=ff", true);
request.onreadystatechange = () => {
  if (request.readyState === 4 && request.status === 200) {
    console.log(request.responseText);
  }
};
request.send();
```

## This 指向

[大佬的文章](https://zhuanlan.zhihu.com/p/23804247)

简单来说：谁调用了函数，谁就是 this

```js
const obj = {
  a: function () {
    console.log(this);
  },
};
obj.a(); // obj  a.call(obj)
a(); // window a.call(undefined)
```

## 闭包是什么

是什么：「函数」和「函数内部能访问到的变量」的总和，就是一个闭包。

作用：

1. 访问隐藏变量
2. 访问函数外部变量

## 立即执行函数

是什么：声明一个函数并且立马调用

作用：

1. 创建一个独立的作用域，外面访问不到，避免变量污染

:::tip 经典面试题
立即执行函数会存储 i 的变量

```js
var liList = ul.getElementsByTagName("li");
for (var i = 0; i < 6; i++) {
  !(function (ii) {
    liList[ii].onclick = function () {
      alert(ii); // 0、1、2、3、4、5
    };
  })(i);
}
```

:::

## 什么是 JOSNP，什么是 CORS，什么是跨域

### JSONP

是什么：通过 script 标签加载数据的方式获取数据，用来当作 JS 代码执行

怎么做：提前页面上声明一个函数，通过接口传参的方式给后台，后台解析到函数名在原始数据上包裹函数名，发送给前端

```js
function jsonp(setting) {
  setting.data = setting.data || {};
  setting.key = setting.key || "callback";
  setting.callback = setting.callback || function () {};
  setting.data[setting.key] = "__onGetData__";
  window.__onGetData__ = function (data) {
    setting.callback(data);
  };

  const script = document.createElement("script");
  const query = [];
  for (let key in setting.data) {
    query.push(`${key}=${encodeURIComponent(setting.data[key])}`);
  }
  script.src = setting.url + "?" + query.join("&");
  document.head.appendChild(script);
  document.head.removeChild(script);
}

jsonp({
  url: "http://photo.sina.cn/aj/index",
  key: "jsonpcallback",
  data: {
    page: 1,
    cate: "recommend",
  },
  callback: function (ret) {
    console.log(ret);
  },
});
```

### CORS

是什么：跨域资源共享，是一种安全机制，用于控制 web 中是否可以请求不同源的资源

：：：tip 关键点

1. 同源策略：浏览器默认实施同源策略，禁止网页从不同源请求资源，这是为了防止恶意网站访问敏感数据
2. CORS 机制：允许服务器声明哪些源可以访问它的资源，从而放宽同源策略的限制
3. 简单请求：某些请求 GET，POST，HEAD，被视为简单请求，不需要预检请求
4. 预检请求：对于非简单的请求，浏览器会发送一个 OPTIONS 请求，来确定是否允许实际请求
5. 响应头：服务器通过设置特定的 HTTP 头，来控制跨源访问
   1. Access-Control-Allow-Origin：允许访问该源的域
   2. Access-Control-Allow-Methods：指定允许的 HTTP 方法
   3. Access-Control-Allow-Headers：u 实际请求中可以使用 HTTP 的头
   4. Access-Control-Allow-Credentials：是否允许发送 Cookie
   5. Access-Control-Expose-Headers：指定哪些响应头暴露给浏览器
   6. Access-Control-Max-Age：指定预检请求结果缓存时间
   7. Access-Control-Allow-Private-Network：允许公共网址访问私有资源
   8. ：：：

## async/await 怎么用，怎么捕获异常

[阮一峰 ES6](https://es6.ruanyifeng.com/?search=async&x=0&y=0#docs/async)

## 如何实现深拷贝

背代码

:::danger 要点

1. 递归
2. 判断类型
3. 检查环
4. 需要忽略原型

:::

## 如何用正则实现 trim

```js
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
```

## 如何实现继承

1. function

```js
function Animal() {
  this.color = color;
}
Animal.prototype.move = function () {};
function Dog(color, name) {
  Animal.call(this, color);
  this.name = name;
}
function temp() {}
temp.prototype = Animal.prototype;
Dog.prototype = new temp();
Dog.prototype.constructor = Dog;
Dog.prototype.say = function () {
  console.log("哈哈");
};
const dog = new Dog("黄色", "阿黄");
```

:::warning 注意

```js
Dog.prototype.constructor = Dog; // 这句代码很重要
```

1. constructor 属性的默认行为：默认情况下，每个函数都有一个 prototype 属性，这个 prototype 对象自动获得一个 constructor 属性，指回这个函数本身
2. 此行代码用于在 new Dog 的时候，构造函数是 Dog 而不是 Animal

:::

2. Class

```js
class Animal {
  constructor(props) {
    this.color = props.color;
  }
  move = () => {};
}
class Dog extends Animal {
  constructor(props) {
    super(color);
    this.name = props.name;
  }
  say = () => {
    console.log("哈哈");
  };
}
```

## 数组如何去重

1. set

```js
new Set([1, 2, 3, 4, 5, 5, 5]);
```

2. 两层 for 循环

```js
function unique(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}
```

3. indexOf

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("type error");
  }
  let tempArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (tempArr.indexOf(arr[i]) < 0) {
      tempArr.push(arr[i]);
    }
  }
  return tempArr;
}
```

4. sort

```js
function unique(arr) {
  arr = arr.sort();
  let array = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i] - 1) {
      array.push(arr[i]);
    }
  }
  return array;
}
```

5. includes

```js
function unique(arr) {
  const tempArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (!tempArr.includes(arr[i])) {
      tempArr.push(arr[i]);
    }
  }
}
```
