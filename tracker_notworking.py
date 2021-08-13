import qbittorrentapi
import urllib.parse

# qb的 ip地址, port，登陆帐号密码，自行修改
qbt_client = qbittorrentapi.Client(host='192.168.1.8', port=8189, username='admin', password='adminadmin')

try:
    qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
    print(e)

# display qBittorrent info
print(f'qBittorrent: {qbt_client.app.version}')
print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')

count = 0
for torrent in qbt_client.torrents_info(sort='name'):
    # 这里我偷懒了，tjupt如果是ipv6的话这里就不对了，用者自行想办法了
    tr3 = torrent.trackers[3]

    # 列出tracker 未工作
    if tr3['status'] == 4:
        count += 1
        print(f'{torrent.hash[-6:]}: \033[32m{torrent.name}\033[0m ({torrent.state})')
        print( f'\033[31m {urllib.parse.urlparse(tr3["url"]).netloc}\033[0m   \033[34m  {tr3["msg"]} \033[0m')
        torrent.addTags(['未工作'])
    else:
        torrent.removeTags(['未工作'])


print(f'Total: {count}')
