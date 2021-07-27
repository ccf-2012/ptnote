# qbitorrent-auto-reflush
使用 qb 的 api 自动刷新种子，解决 unresigered torrent


# 安装依赖
```bash
pip3 install qbittorrentapi
```

# 配置账号密码端口信息

在`qbit-unresigered-torrent-fix.py ` 当中写入配置信息。

```python
hostname = '127.0.0.1'  # IP 或者域名，
qb_username = 'admin'  #qb 账户
qb_password = 'adminadmin'  #qb 密码
```

# 下载脚本
```
wget -P /root https://raw.githubusercontent.com/ccf-2012/ptnote/main/qbittorrent-auto-reflush/qbittorrent-auto-reflush.py
```

# 加入 crontab

首先在命令行输入 `crontab -e `，然后写入下列代码即可。

```bash
*/1 * * * * python3 /root/qbit-unresigered-torrent-fix.py 
*/1 * * * * sleep 30; python3 /root/qbit-unresigered-torrent-fix.py 
```
