### store 字段

1. prevPage，用于记录页面名称，登录后跳到对应页面
2. 登录成功设置 token, isLogin
3. localStorage origin: 记录身份验证的前一个页面，小白页面通过origin来判定完成后跳转页面

 下单 ==> ID（下一步）==> 小白 ==> 活体
 个人 ==> ID（保存）
 个人 ==> 小白 ==> ID（下一步） ==> 小白


4. 发布修改Credit里面路径，router里面跳转路径

5. drag.js

android上阻止元素默认事件preventDefault，会影响七鱼的click触发
增加阻止事件冒泡 stopPropagation，不影响元素本身的touchstart, 与click事件，不影响七鱼的click
防止body的touch受影响
