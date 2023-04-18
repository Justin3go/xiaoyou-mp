<template>
	<view class="help-service-container">
		<uni-title type="h1" align="center" title="功能介绍"></uni-title>
		<uni-title type="h2" title="1. 使用笑友小程序的主要流程"></uni-title>
		<uni-title type="h3" title="1.1 一键登录"></uni-title>
		<text>&nbsp;&nbsp;&nbsp;&nbsp;首先在“我的”页面中点击一键登录/注册，未注册的用户会自动注册。之后请及时完善你的相关信息，特别是头像以及昵称，推荐直接使用微信头像以及微信昵称，方便后续好友能在该小程序中快速定位到你的存在。 </text>
		<uni-title type="h3" title="1.2 填写所选问卷"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;然后在“问卷”页面切换到未填的问卷列表，选择其中一份你想要填写的问卷，比如人格倾向调查问卷。点击填写会跳转到填写页面，然后完成填写并提交成功就可以了。</text>
		<uni-title type="h3" title="1.3 分享你已填问卷给好友"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;问卷填写完成后，继续在“问卷页面切换到已填的问卷列表，选择你想要分享的问卷，比如上面填写的人格倾向调查问卷。点击分享并确认会自动跳转到微信客户端，然后选择你想要分享的微信好友并分享。”</text>
		<uni-title type="h3" title="1.4 好友填写该份问卷"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;你的好友在收到你发的分享卡片之后，直接点入该分享卡片进入小程序，未登录的用户需要先登录，登录之后会自动跳转到填写页面，然后你的好友通过换位思考站在你的角度上填写该问卷，填写完成并提交答案。</text>
		<uni-title type="h3" title="1.5 查看可视化结果"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;跳转到“可视化”页面，在最上方选择你刚刚填写的问卷名称，就可以查看到对应的可视化结果了，比如人格倾向的雷达图可视化：选择两位好友，可以对比查看最终的可视化结果。</text>
		<uni-title type="h3" title="1.6 查看排行榜结果"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;跳转到“我的”页面，在上方有“关于自己”与“关于好友”两个入口，点入之后并选择问卷就可以分别查看帮助自己填写问卷的好友与我自己填写该问卷的相似度，以及我帮助其他好友与它们自己填写问卷的相似度。</text>
		<uni-title type="h2" title="2. 问卷功能介绍"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;问卷功能分为问卷填写、问卷查看以及问卷分享功能，已经填写的问卷暂时并不支持二次修改，所以填写问卷的时候请谨慎填写，从自己的真实情况出发，最后反馈的结果才是有效的。</text>
		<uni-title type="h2" title="3. 可视化功能介绍"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;不同的问卷有不同的可视化类型，比如人格倾向问卷属于雷达图的可视化类型，后续在新增问卷的时候也会在这里新增可视化页面，敬请期待！</text>
		<uni-title type="h2" title="4. 排行榜功能介绍"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;在“我的”页面上有“关于自己”与“关于他人”的排行榜入口，“关于自己”是统计为自己填写问卷的好友们对于我自己的一个相似度排行，相似度越高排行越高也代表着你们两个可能关系更亲切，认识更充分；“关于他人”是统计好友们分享过来的问卷被我填写后，我与这些好友的相似度排行。</text>
		<uni-title type="h2" title="5. 用户功能介绍"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;用户可以在“我的”页面一键登录或注册，没有登录的用户几乎不能使用任何功能，同时推荐用户及时修改完善自己的昵称与头像等相关信息。</text>

		<uni-title type="h1" align="center" title="FAQ"></uni-title>
		<uni-title type="h2" title="1. 如何理解换位思考"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;自我评价很多时候会出现认知偏差的情况，所以想要全面的了解自己的情况，结合他人评价是非常有必要的，所以这也似乎该小程序出现的原因之一，用户分享问卷给自己好友之后，好友将换位思考站在用户自己的角度进行问卷的填写，这样用户自己就得到了这位好像的一个评价，即他认为我会在这方面怎么思考。</text>
		<uni-title type="h2" title="2. 填写完问卷后对我自己有什么作用"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;填写完问卷后，你就可以在可视化结果中查看自己的分析结果了，随着你分享该问卷的次数增多，最后的可视化结果也会更加客观，同时，后续小程序会新增心理问答以及专家入住功能，如果你有任何问题，都可以对它们进行提问。</text>
		<uni-title type="h2" title="3. 我可以不填写问卷就直接分享给好友吗"></uni-title>
    <text>&nbsp;&nbsp;&nbsp;&nbsp;不行，由于后台计算首先需要你自己的填写结果，所以暂时不支持不填写而直接分享。</text>
	</view>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.help-service-container {
	padding: 20px;
  background-color: #FFFFFF;
}
text {
	font-size: 14px;
	line-height: 22px;
	color: #333;
}
</style>
