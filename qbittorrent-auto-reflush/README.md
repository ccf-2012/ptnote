# qbitorrent-auto-reflush
使用 qb 的 api 自动刷新种子，解决 unresigered torrent


# 安装依赖
```bash
pip3 install qbittorrentapi
```

# 加入 crontab

首先在命令行输入 `crontab -e `，然后写入下列代码即可。

```bash
*/1 * * * * python3 /root/qbit-unresigered-torrent-fix.py 
*/1 * * * * sleep 30; python3 /root/qbit-unresigered-torrent-fix.py 
```
