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
