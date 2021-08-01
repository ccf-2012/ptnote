import qbittorrentapi
import urllib.parse
import re


# qb的 ip地址, port，登陆帐号密码，自行修改
QB_PARAM = {
    'host': '192.168.1.8',
    'port': 8189,
    'username': 'admin',
    'password': 'adminadmin'
}


def qbAutoTag(qbt_client):

    for torrent in qbt_client.torrents_info(sort='name'):
        # 这里我偷懒了，如有问题，使用者自行想办法了
        tr3 = torrent.trackers[3]

        hostnameList = urllib.parse.urlparse(tr3["url"]).netloc.split('.')
        if len(hostnameList) == 2:
            tagstr = hostnameList[0]
        elif len(hostnameList) == 3:
            tagstr = hostnameList[1]
        else:
            tagstr = ''

        torrent.removeTags([])
        torrent.addTags([tagstr])
        print(
            f'{tagstr}: \033[32m{torrent.name}\033[0m ({torrent.state})')

        # 列出tracker 未工作
        if tr3['status'] == 4:
            torrent.addTags(['未工作'])


def main():
    qbt_client = qbittorrentapi.Client(host=QB_PARAM['host'], port=QB_PARAM['port'],
                                       username=QB_PARAM['username'], password=QB_PARAM['password'])

    try:
        qbt_client.auth_log_in()
    except qbittorrentapi.LoginFailed as e:
        print(e)

    # display qBittorrent info
    print(f'qBittorrent: {qbt_client.app.version}')
    print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')

    qbAutoTag(qbt_client)


if __name__ == '__main__':
    main()
