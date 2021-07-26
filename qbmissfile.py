import qbittorrentapi

# instantiate a Client using the appropriate WebUI configuration
qbt_client = qbittorrentapi.Client(host='192.168.1.8', port=8189, username='admin', password='adminadmin')

try:
    qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
    print(e)

# display qBittorrent info
print(f'qBittorrent: {qbt_client.app.version}')
print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')

count = 0
# retrieve and show all torrents
for torrent in qbt_client.torrents_info(status_filter='errored'):
    tr3 = torrent.trackers[3]

    count += 1
    print(f'{torrent.hash[-6:]}: \033[32m{torrent.name}\033[0m ({torrent.state})')
    # print( f'\033[31m {urllib.parse.urlparse(tr3["url"]).netloc}\033[0m   \033[34m  {tr3["msg"]} \033[0m')
    print(f'{torrent.save_path}')
    # torrent.setLocation(location=torrent.save_path)
    # torrent.recheck()

print(f'Total: {count}')

