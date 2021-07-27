# PT Note
> 一些玩PT时写的脚本，需要的自取自改，风险自负

## 基本环境
1. Anaconda & env
```sh
conda update conda
conda create -n qb python=3.6
conda activate qb
```
2. qbittorrent-api & parse-torrent-title
* https://qbittorrent-api.readthedocs.io/en/latest/index.html
* https://github.com/platelminto/parse-torrent-title
```sh 
pip install qbittorrent-api
pip install parse-torrent-title
```
1. VSCode (option)
* https://code.visualstudio.com/docs/languages/python

## 脚本列表
1. 列出qb中 `未工作` 的种子: qb中经常有一些种子，由于某些原因默默地变成了`未工作`，而在webui中仍然是作种等待上传状态，无法一眼看出来，需要逐一点到种子上看tracker状态才能发现，本脚本用于快速找到这些种子。
2. 修改tracker的 `https` 为 `http`: 发现有一些站tracker为https时会不工作，而在http时正常，这些种子在webui中也是难以一眼找出的，此脚本用于快速列出并进行修改。
3. 自动分类：Movie 和 TV 在刮削的时候要分开，然后MovieEncode可以emby和nPlayer播放，BDMV的就放单独目录去，到电视上看时可以用。如果你在下载时没有作好分类，那么使用本脚本根据种子名进行快速分类。由于所有的信息都只是通过种子名进行猜测，所以必然有错漏，需要进一步手工调整。
4. qbittorrent-auto-reflush，在某些外站可能会出现 irssi 下载种子要比 tracker 更新快的情况，这个脚本可以自动刷新 qbittorrent 出现的 `unregister` 的种子，详细用法请点击文件夹查看。



