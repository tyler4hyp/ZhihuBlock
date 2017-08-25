# 知乎屏蔽插件（chrome)

主要有以下关键点：

## 获取屏蔽用户的列表

通过jquery的get方法获取，也就是ajax的方式。

## 页面更新数据之后再次执行屏蔽

有两种方式，第一种是检测页面dom结构的变化，需要用到 Mutation Observer
这个API。好处在于它是异步触发，DOM的变动并不会马上触发，而是要等到当前所有DOM操作都结束才触发。
（如果使用DOMSubtreeModified事件很容易使浏览器崩溃，因为触发太频繁）。

第二种是使用jquery的ajaxComplete方法，不过因为chrome扩展的js和页面是隔离的，无法检测到页面的ajax事件，所以必须手动把js文件插入到页面里。

本插件使用第一张方法。

## js文件之间的通信和关键字存储

此处使用了chrome.storage的相关API，好处在于存储的内容是跨域的, 并且在数据变动时会触发onChanged事件。（localStorage不能跨域，如果使用localstorage则必须使用其他方式来跨域通信）。