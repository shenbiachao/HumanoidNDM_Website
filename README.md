# HumanoidNDM 项目主页

英文静态科研项目主页，参考 [Focus-Then-Decide](https://www.lamda.nju.edu.cn/chenc/FTD.html) 的布局。内容来自 `../CoRL_2026_Camera_Ready/` 和 `../videos/README.md`，包含全部 9 段视频。

## 本地查看

直接用浏览器打开 `index.html`，或者在本目录运行：

```bash
python serve.py
```

访问 http://127.0.0.1:8000 。预览脚本支持视频分段请求和进度拖动；可用 `python serve.py --port 8080` 更换端口。不需要 npm、构建步骤或在线字体/CDN。

## 文件结构

- `index.html`：作者、机构、摘要、方法、视频、实验数据、BibTeX。
- `style.css`：桌面及手机布局、排版和配色。
- `script.js`：图片放大、BibTeX 复制和单视频播放控制。
- `serve.py`：仅用于本地预览的标准库 HTTP 服务器，支持视频 Range 请求。
- `assets/images/`：由论文原始 PDF 图表转换的 WebP 图片。
- `assets/videos/`：全部 9 段视频的 H.264 / AAC、720p 网页副本，保留完整时长和声音，启用 faststart。
- `assets/posters/`：从原视频提取的封面。
- `assets/paper/HumanoidNDM.pdf`：用 Tectonic 从所提供 LaTeX 源文件编译的完整论文，包含附录。
- `assets/paper/citation.bib`：与页面一致的引用信息。

## 内容维护

- 修改文案和数据：编辑 `index.html`；BibTeX 同时更新页面与 `assets/paper/citation.bib`。
- 添加或替换视频：使用 H.264 视频、AAC 音频及 `yuv420p` 像素格式，更新对应 `source` 与 `poster`。原始 HEVC 视频未被改动。
- 顶部 arXiv 按钮链接至 `https://arxiv.org/abs/2610.34126v1`，Code 按钮链接至 `https://github.com/shenbiachao/HumanoidNDM`，均在新标签页打开。本地编译论文仍保存在 `assets/paper/HumanoidNDM.pdf`。
- 主页中的 canonical、Open Graph 和 BibTeX URL 沿用论文中的 `https://pku-epic.github.io/HumanoidNDM`；若更换部署地址，应同步修改。
- 六项实机任务指标均取自论文 Table 3 的任务完成度指标；展开表格保留均值和标准差。30% / 47% 是论文报告的 15 个仿真设置下相对 Direct Transfer 的平均误差降低，未将其表述为实机结果。
- 额外的持续适应与舞蹈视频说明来自 `videos/README.md`。阶段性加重演示与论文关于时不变扰动的适用范围在网页中分别说明。

## 部署

本目录是独立可部署的静态网站，全部资源使用相对路径，保留 `.nojekyll`。

- 网站源仓库：<https://github.com/shenbiachao/HumanoidNDM_Website>，分支 `main`。
- 组织主页仓库：<https://github.com/PKU-EPIC/PKU-EPIC.github.io>。
- 挂载方式：组织主页通过 `HumanoidNDM` 子模块引用本仓库，沿用 DyWA 的方式。
- 发布地址：<https://pku-epic.github.io/HumanoidNDM/>。

首次接入时，在组织主页仓库中添加子模块，将 `.gitmodules` 和子模块记录一起提交并合并到发布分支：

```bash
git submodule add -b main https://github.com/shenbiachao/HumanoidNDM_Website.git HumanoidNDM
```

后续先将网页修改推送到本仓库的 `main` 分支，再在组织主页仓库中更新子模块版本：

```bash
git submodule update --init --remote HumanoidNDM
git add HumanoidNDM
git commit -m "Update HumanoidNDM project page"
```

将组织主页的更新提交合并后，由现有 GitHub Pages 流程发布。子模块固定引用一个提交，仅推送本仓库不会自动更新线上页面。本仓库无需单独启用 GitHub Pages。
