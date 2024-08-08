# CSS

## BFC 是什么

1. 是什么：块级格式化上下文
2. 怎么做：
   - 浮动元素：元素 float 不为 none
   - 绝对定位元素：position 为 absolute 或 fixed
   - 行内块：inline-block 元素
   - overflow 不为 visible 元素
   - 弹性元素：display 为 flex 或 inline-flex 元素的直接子元素
3. 解决了什么问题
   - 清除浮动
   - 防止 margin 合并

## 如何实现垂直居中

1. table 自带功能

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      border: 1px solid red;
      height: 600px;
    }

    .child {
      border: 1px solid green;
    }
  </style>
  <body>
    <table class="parent">
      <tr>
        <td class="child">
          一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
        </td>
      </tr>
    </table>
  </body>
</html>
```

2. 100%高度的 after before 加上 inline block

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      border: 3px solid green;
      height: 600px;
      text-align: center;
    }

    .child {
      border: 3px solid black;
      display: inline-block;
      width: 300px;
      vertical-align: middle;
    }

    .parent:before {
      outline: 3px solid red;
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    .parent:after {
      outline: 3px solid red;
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  </style>
  <body>
    <div class="parent">
      <div class="child">
        一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
      </div>
    </div>
  </body>
</html>
```

3. div 装成 table

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    div.table {
      display: table;
      border: 1px solid red;
      height: 600px;
    }

    div.tr {
      display: table-row;
      border: 1px solid green;
    }

    div.td {
      display: table-cell;
      border: 1px solid blue;
      vertical-align: middle;
    }
    .child {
      border: 10px solid black;
    }
  </style>
  <body>
    <div class="table">
      <div class="td">
        <div class="child">
          一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
        </div>
      </div>
    </div>
  </body>
</html>
```

4. 绝对定位

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      height: 600px;
      border: 1px solid red;
      position: relative;
    }
    .child {
      border: 1px solid green;
      width: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -150px;
      height: 100px;
      margin-top: -50px;
    }
  </style>
  <body>
    <div class="parent">
      <div class="child">
        一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
      </div>
    </div>
  </body>
</html>
```

5. translate -50%

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      height: 600px;
      border: 1px solid red;
      position: relative;
    }
    .child {
      border: 1px solid green;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
  <body>
    <div class="parent">
      <div class="child">
        一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
      </div>
    </div>
  </body>
</html>
```

6. margin auto

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      height: 600px;
      border: 1px solid red;
      position: relative;
    }
    .child {
      border: 1px solid green;
      position: absolute;
      width: 300px;
      height: 200px;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  </style>
  <body>
    <div class="parent">
      <div class="child">
        一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
      </div>
    </div>
  </body>
</html>
```

7. flex

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>JS Bin</title>
  </head>
  <style>
    .parent {
      height: 600px;
      border: 3px solid red;

      display: flex;
      justify-content: center;
      align-items: center;
    }
    .child {
      border: 3px solid green;
      width: 300px;
    }
  </style>
  <body>
    <div class="parent">
      <div class="child">
        一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字一串文字
      </div>
    </div>
  </body>
</html>
```

## CSS 选择器优先级

[标准答案](http://www.ayqy.net/doc/css2-1/cascade.html#specificity)

如果记不住，那么记住这三句话

1. 选择器越具体，优先级越高
2. 相同优先级，出现在后面的，覆盖前面的
3. 属性后加 !important 优先级最高，但是少用

## 如何清除浮动

1. 给父元素加 .clearfix

```css
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.clearfix {
  zoom: 1;
}
```

2. 给父元素加入 overflow:hidden

## 两种盒模型的区别

box-sizing 属性：用于规定元素的宽高计算方法

1. border-box（常用）：width 指定的是左右框外侧的距离
   > 实际宽度 = width + padding + border
2. content-box（默认）：width 指定的是 content 实际宽度
   > 实际宽度 = width

## Flex 怎么用，常用属性有哪些

1. 是什么：弹性布局，一种 CSS 布局形式
2. 常用属性
   - flex-direction：主轴方向
   - justify-content：主轴对齐方式
   - align-items：交叉轴对齐方式
   - flex-warp：是否换行
   - flex-grow：放大比例
   - flex-shrink：缩小比例
   - flex-basis：分配多余空间之前，占据的主轴空间
   - flex：前三个属性的简写，作用为占据剩余空间，撑满父容器
   - align-self：自我元素的对齐方式


