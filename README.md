# PT Note
> 一些玩PT时写的脚本，需要的自取自改

## 基本环境
1. Anaconda & env
```sh
conda update conda
conda create -n qb python=3.6
conda activate qb
```
2. qbittorrent-api
> https://qbittorrent-api.readthedocs.io/en/latest/index.html
```sh 
pip install qbittorrent-api
```
3. VSCode (option)
> https://code.visualstudio.com/docs/languages/python

## 脚本列表
1. 列出qb中 `未工作` 的种子: qb中经常有一些种子，由于某些原因默默地变成了`未工作`，而在webui中仍然是作种等待上传状态，无法一眼看出来，需要逐一点到种子上看tracker状态才能发现，本脚本用于快速找到这些种子。
2. 修改tracker的 `https` 为 `http`: 发现有一些站tracker为https时会不工作，而在http时正常，这些种子在webui中也是难以一眼找出的，此脚本用于快速列出并进行修改。
3. 修改missing file的文件位置: pending




