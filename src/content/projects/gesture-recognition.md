---
title: 手势识别原型（MediaPipe + OpenCV）
description: 用 MediaPipe HandLandmarker 做实时手部 21 点关键点捕捉，再用手指关节角度的规则法识别 16 种手势。
tech:
  - Python
  - OpenCV
  - MediaPipe
  - Computer Vision
featured: true
order: 80
---

**做了什么**

- `demo.py`：摄像头实时捕捉手部 21 个关键点，按手指分色渲染骨架并显示平均帧率；隔帧处理以降低延迟，支持按键截图
- `gesture_recognizer.py`：用**手指关节角度**做规则判定——先把每根手指分成弯曲 / 半开 / 伸直三种状态，再匹配 16 个手势模板（Fist、Thumbs Up、Pointing、Peace、ILoveYou、Rock、Open Palm、Three、Four…），另有 2 个基于距离条件的手势（OK、Pinch）；带同义词归并与滑动窗口平滑，减少抖动引起的误判

**定位**

这是一个**原型**：验证「用现成的关键点模型 + 规则法，能不能把常见手势稳定分出来」。指标很直接——在摄像头前换手势时，识别结果是否稳定、切换是否及时。

没有做 CNN 分类训练；如果要做连续动作识别，需要另外训练模型。代码暂未单独建仓，所以这里不提供链接。

**注** 这个项目参考了其他的项目，没有列出，如有侵权联系删除