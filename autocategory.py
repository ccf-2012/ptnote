import qbittorrentapi
import urllib.parse
import re
import PTN

# qb的 ip地址, port，登陆帐号密码，自行修改
QB_PARAM = {
    'host': '192.168.1.6',
    'port': 8091,
    'username': 'admin',
    'password': 'adminadmin'
}
# 注意qb的存储位置
QB_ROOT = '/Downloads/'
# 分了这样 8 类，后面数字是输出字符的颜色，真改之前方便检查
CATEGORIES = [
    ['TV', '32'],
    ['MV', '31'],
    ['Audio', '34'],
    ['MovieEncode', '36'],
    ['MovieRemux', '36'],
    ['MovieWebdl', '36'],
    ['MovieBDMV', '35'],
    ['Other', '33']
]
counts = [0, 0, 0, 0, 0, 0, 0, 0]


def setCategory(torrent, catid):
    counts[catid] += 1
    print(
        f'{CATEGORIES[catid][0]}: \033[{CATEGORIES[catid][1]}m{torrent.name}\033[0m ({torrent.state})')
    # 真要修改，就去掉下面的注释
    # torrent.setCategory(CATEGORIES[catid][0])
    # 要一并修改磁盘上存储的位置就把下面注释拿掉，一定抬头看一下上面的QB_ROOT的位置
    # torrnt.setLocation(QB_ROOT+CATEGORIES[catid][0])
    return


def qbAutoCategory(qbt_client):
    # 如果有些分类已经设好，不想重新识别分类的放在 skipCategories
    skipCategories = ['儿童剧集', '儿童', 'Music', 'Audio']
    # 有些组生产 TV Series，但是在种子名上不显示 S01 这些
    tvGroups = ['CMCTV', 'DBTV', 'FLTTH']
    # 有些Web组，即生产TV又生产Movie，种子名上又不显示，得看文件
    webGroups = ['CHDWEB', 'PTerWEB', 'HaresWEB', 'LeagueWEB', 'HDCTV']
    # 有些组专门生产 MV
    mvGroups = ['PterMV']
    # 有些组专门生产 Audio
    audioGroups = ['PTHAudio']
    # 有些组专门作压制，但是不在种子名上标记
    movieEncodeGroup = 'CMCT'

    for torrent in qbt_client.torrents_info(sort='name'):
        ### 注意，所有torrent都会设为 **非自动** 管理，否则修改了分类将引发文件搬移
        torrent.use_auto_torrent_management = False

        if torrent.category not in skipCategories:
            info = PTN.parse(torrent.name)
            # 有season和episode 或 专作TV的Group
            if info.__contains__('season') or info.__contains__('episode') or \
                    (info.__contains__('encoder') and info['encoder'] in tvGroups):
                setCategory(torrent, 0)
            elif re.search(r'S0\d\W|\d季\W|[一二三]季\W', torrent.name, re.I):
                setCategory(torrent, 0)
            elif info.__contains__('encoder') and info['encoder'] in webGroups:
                if len(torrent.files) > 3:
                    setCategory(torrent, 0)
            elif info.__contains__('encoder') and info['encoder'] in mvGroups:
                setCategory(torrent, 1)
            elif info.__contains__('encoder') and info['encoder'] in audioGroups:
                setCategory(torrent, 2)
            elif info.__contains__('quality'):
                # 来源为原盘的
                if info['quality'] in ['Blu-ray']:
                    # 压制 还是 原盘
                    if re.search(r'\WREMUX\W', torrent.name, re.I):
                        setCategory(torrent, 4)
                    elif re.search(r'\Wx265\W|\Wx264\W', torrent.name, re.I):
                        setCategory(torrent, 3)
                    else:
                        setCategory(torrent, 6)
                # 来源是 WEB-DL
                elif info['quality'] in ['WEB-DL']:
                    setCategory(torrent, 5)
            elif info.__contains__('encoder') and info['encoder'].find(movieEncodeGroup):
                setCategory(torrent, 3)
            else:
                setCategory(torrent, 7)

    for i in range(len(counts)):
        print(f'{CATEGORIES[i][0]} : {counts[i]}')
    print(f'Total : {sum(counts)}')

### 
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

    qbAutoCategory(qbt_client)

if __name__ == '__main__':
    main()
