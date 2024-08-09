# HTTP

## 状态吗

- 2xx：表示成功
- 3xx：表示进一步操作
- 4xx：表示浏览器错误
- 5xx：表示服务器错误

## 缓存

1. ETag：通过对比浏览器和服务器的特征值决定是否要发送文件内容，如果一样就发送 304
2. Expires 设置过期时间，如果用户本地时间错乱会有问题
3. CacheControl：max-age=3600 设置过期时长（相对时间），和本地时间无关

## GET 和 POST 区别

1. 数据传输
   - GET：url 末尾
   - POST：消息体中
2. 数据可见性
   - URL 中可见
   - URL 不可见
3. 数据大小限制
   - GET：URL 不超过 2KB
   - POST：可以传大量数据
4. 缓存：
   - GET：请求被缓存，收藏，保留在浏览器历史中
   - POST：通常不会缓存，除非指示
5. 幂等：
   - GET：幂等的，每次请求结果都相同
   - POST：非幂等，每次调用都可能修改数据
6. 用途：
   - GET：用于获取数据
   - POST：用于提交数据
7. 编码类型：
   - GET: application/x-www-form-urlencoded
   - POST: application/x-www-form-urlencoded 或 multipart/form-data
8. 后退/刷新
   - GET：一般是无害的
   - POST：可能会被重新提交
9. 书签
   - GET：可以被收藏位书签
   - POST：不能收藏为书签
- 
