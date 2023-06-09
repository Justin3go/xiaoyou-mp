# xiaoyou-mp（笑友）

[![](https://oss.justin3go.com/blogs/uniapp-vue3_vite-brightgreen%203.svg)](https://uniapp.dcloud.net.cn/tutorial/vue3-basics.html) [![](https://oss.justin3go.com/blogs/graphql-villus-green.svg)](https://villus.logaretm.com/) ![](https://oss.justin3go.com/blogs/typescript-typescript-blue.svg)

笑友是一款基于uniapp，使用vue3-typescript/vite、graphql/villus开发的心理健康公益小程序，期望以一种游戏化的方式让用户填写心理健康问卷，以朋友分享、换位思考、可视化对比等多种创新功能提高趣味性及优化结果有效性。

## 出现原因

无论是随时间出现的互联网、新冠疫情、短视频、网络社交媒体，还是长期以往存在的如高考、宿舍氛围、人际交往、就业压力等都无时无刻考验着青少年的心理健康，据相关研究表明，出现心理健康问题的青少年不在少数，并且一些心智成熟的成年人同样也面临着心理健康问题的煎熬。

心理健康问题危害极大，国家高度重视，出台了相关政策完善心理健康体系。

但目前的情况仍然有3个痛点。分别是普及难、发现难、解决难。而“互联网+心理健康系统”被多篇论文及文章指出是解决心理健康问题的重要途径之一。

该小程序基于该理念，并结合特有的一些创新点（好友互换角度填写问卷，及时可视化正反馈，以及朋友之间相互分享等）可以很好地解决这这些痛点，这也是本仓库出现的原因，希望为社会的心理健康体系的完善尽上自己的绵薄之力。

![QQ截图20230527153125](https://github.com/Justin3go/xiaoyou-mp/assets/63507251/5751189b-401a-46f4-a6c1-c70daf4a42fa)

## 扫描体验

![xiaoyou-mp-code](https://user-images.githubusercontent.com/63507251/233824885-dc73c732-0efa-4c35-933b-9b22fc964734.png)

## 用户使用教程

> 你可以在小程序(我的/帮助中心)或者(我的/智能客服)中找到对应的使用文档。

1. 首先在“我的”页面中点击一键登录/注册，未注册的用户会自动注册。之后请及时完善你的相关信息，特别是头像以及昵称，推荐直接使用微信头像以及微信昵称，方便后续好友能在该小程序中快速定位到你的存在。
2. 然后在“问卷”页面切换到未填的问卷列表，选择其中一份你想要填写的问卷，比如人格倾向调查问卷。点击填写会跳转到填写页面，然后完成填写并提交成功就可以了。
3. 问卷填写完成后，继续在“问卷页面切换到已填的问卷列表，选择你想要分享的问卷，比如上面填写的人格倾向调查问卷。点击分享并确认会自动跳转到微信客户端，然后选择你想要分享的微信好友并分享。
4. 跳转到“可视化”页面，在最上方选择你刚刚填写的问卷名称，就可以查看到对应的可视化结果了，比如人格倾向的雷达图可视化：选择两位好友，可以对比查看最终的可视化结果。 
5. 你的好友在收到你发的分享卡片之后，直接点入该分享卡片进入小程序，未登录的用户需要先登录，登录之后会自动跳转到填写页面，然后你的好友通过换位思考站在你的角度上填写该问卷，填写完成并提交答案。

![笑友主要功能图](https://user-images.githubusercontent.com/63507251/233826785-6ff31b6b-5f3c-4151-a6da-52cb95d48701.png)

## ChangeLog

Detailed changes for each release are documented in the [CHANGELOG](https://github.com/Justin3go/xiaoyou-mp/blob/main/CHANGELOG.md).

## 开发

环境变量，在根目录添加`.env`文件，文件内容如下：

```
VITE_SERVER_IP="https://api.justin3go.com"
```

暂时只支持微信小程序，其他小程序版本未做兼容处理。

```shell
npm i
npm run dev:mp-weixin
```

然后使用微信开发工具打开对应的`dist/dev/mp-weixin`文件夹就可以进行预览开发了

## TODO

- 升级VIP入口
- GPT流式回复增加等待体验
- 增加用户引导程序
- 完成代码中已知TODO
- 轻社区
- 心理专家/咨询师入驻功能
- 增加更多可用的心理问卷及对应的可视化类型
