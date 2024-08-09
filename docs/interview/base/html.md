# HTML

## 讲讲 HTML 语义化标签

1. 是什么：语义化标签是一种写 HTML 标签的方法论/方式
2. 怎么做：实现方法就是遇到标题用 h1 ～ h6，遇到段落用 p，遇到文章用 article，主要内容用 main，边栏用 aside，导航用 nav（就是找到中文对应的英文）
3. 解决了什么问题：明确了 HTML 的书写规范
4. 优点：适合搜索引擎检索、适合人类阅读，利于团队维护
5. 缺点：没有
6. 怎么解决缺点：无需解决

> 总结：是什么，怎么做，解决了什么问题，优缺点，怎么解决缺点

## HTML5 有哪些新标签

- 文章相关：header main footer nav section article figure mark
- 多媒体相关：video audio svg canvas
- 表单相关：type=email type=tel

## Canvas 和 SVG 区别

1. Canvas 主要用笔刷绘制 2D 图形
2. SVG 主要用标签绘制不同规则矢量图
3. 相同点：
   1. 都是用来画 2D 图形
4. 不同点：
   1. SVG 画的是矢量图，Canvas 画的是位图
   2. SVG 节点过多时渲染慢，Canvas 性能更好，但写起来复杂
   3. SVG 支持分层和事件，Canvas 不支持，但可以用库实现

:::tip 思路
区分题，答题思路：先说一，后说二，再说相同点，最后说不同点
:::

## meta viewport 作用

1. 是什么：用于控制移动设备网页显示方式，主要应用于网页响应式设计，确保兼容不同设备
2. 常用属性
   - width：控制视口宽度
   - initial-scale：控制页面初始缩放比例
   - maximum-scale：控制页面缩放最大比例
   - minimum-scale：控制页面缩放最小比例
   - user-scalable：是否允许用户进行缩放

## 事件委托

```js
function delegate(element, eventType, selector, fn) {
  element.addEventListener(eventType, (e) => {
    let el = e.target;
    while (!el.matches(selector)) {
      if (element === el) {
        el = null;
        break;
      }
      el = el.parentNode;
      el && fn.call(el, e, el);
    }
  });
  return element;
}
```

## 用 Mouse 事件写一个可拖拽的 div

```js
let dragging = false;
let position = null;
el.addEventListener("mousedown", function (e) {
  dragging = true;
  position = [e.clientX, e.clientY];
});
el.addEventListener("mousemove", function (e) {
  if (dragging === false) return;
  const x = e.clientX;
  const y = e.clientY;
  const deltaX = x - position[0];
  const deltaY = y - position[1];
  const left = parentInt(el.style.left || 0);
  const top = parentInt(el.style.top || 0);
  el.style.left = left + deltaX + "px";
  el.style.top = top + deltaY + "px";
  position = [x, y];
});
el.addEventListener("mouseup", function () {
  dragging = false;
});
```
