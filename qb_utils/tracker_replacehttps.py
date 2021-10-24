import qbittorrentapi

# qb的 ip地址, port，登陆帐号密码，自行修改
qbt_client = qbittorrentapi.Client(host='192.168.1.8', port=8089, username='admin', password='adminadmin')

try:
    qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
    print(e)

# display qBittorrent info
print(f'qBittorrent: {qbt_client.app.version}')
print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')

# 不方便暴露地址，自己填全tracker主机名
pterUrls = 'https://tracker.'
pterUrl = 'http://tracker.'

count = 0
for torrent in qbt_client.torrents_info(sort='name'):
    # 这里我偷懒了，用者自便
    tr3 = torrent.trackers[3]

    # 未工作的tracker，https 改为 http
    if tr3['url'].startswith(pterUrls) and tr3['status'] == 4:
        count += 1
        print(f'{torrent.hash[-6:]}: \033[32m{torrent.name}\033[0m ({torrent.state})')
        print(tr3['url'][:38])
        newUrl = tr3['url'].replace(pterUrls, pterUrl, 1)
        print(newUrl[:38])

        # 真改就把下面这句注释拿掉, ( 我不敢
        # torrent.edit_tracker(tr3['url'], newUrl)

print(f'Total: {count}')
