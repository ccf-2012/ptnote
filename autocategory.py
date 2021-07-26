import qbittorrentapi
import urllib.parse
import re
import PTN 
# https://github.com/divijbindlish/parse-torrent-name

# qb的 ip地址, port，登陆帐号密码，自行修改
qbt_client = qbittorrentapi.Client(host='192.168.1.8', port=8189, username='admin', password='adminadmin')

try:
    qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
    print(e)

# display qBittorrent info
print(f'qBittorrent: {qbt_client.app.version}')
print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')

### 注意qb的存储位置
QB_ROOT = '/Downloads/'
CATEGORIES = [
    ['TV', '32'],
    ['MV', '31'],
    ['Audio', '34'],
    ['MovieEncode', '36'],
    ['MvoieRemux', '36'],
    ['MvoieWebdl', '36'],
    ['MvoieBDMV', '35'],
    ['Other', '33']
]
counts = [0, 0, 0, 0, 0, 0, 0, 0]

def setCategory(torrent, catid):
    counts[catid] += 1
    print(f'{CATEGORIES[catid][0]}: \033[{CATEGORIES[catid][1]}m{torrent.name}\033[0m ({torrent.state})')
    ### 真要修改，就去掉下面的注释
    # torrent.setCategory(CATEGORIES[catid][0])
    ### 要一并修改位置就把下面注释拿掉，一定抬头看一下上面的QB_ROOT的位置
    # torrnt.setLocation(QB_ROOT+CATEGORIES[catid][0])
    return

def qbAutoCategory():
    # 如果有些分类已经设好，不想重新识别分类的放在 skipCategories
    skipCategories = ['儿童剧集', '儿童', 'Music']
    # 有些组只生产 TV Series，但是在种子名上不显示 S01 这些
    tvGroups = ['CMCTV', 'PTerWeb', 'CHDWEB', 'DBTV', 'HDCTV', 'FLTTH']
    # 有些组专门生产 MV
    mvGroups = ['PterMV']
    # 有些组专门生产 Audio
    audioGroups = ['PTHAudio']
    # 有些组专门作压制，但是不在种子名上标记
    movieEncodeGroup = 'CMCT'

    for torrent in qbt_client.torrents_info(sort='name'):
        torrent.use_auto_torrent_management = None

        if torrent.category not in skipCategories:
            info = PTN.parse(torrent.name)
            # 有season和episode 或 专作TV的Group
            if info.__contains__('season') or info.__contains__('episode') or \
            (info.__contains__('encoder') and info['encoder'] in tvGroups):
                setCategory(torrent, 0)
            elif re.search(r'\d季\s', torrent.name, re.I):
                setCategory(torrent, 0)
            elif info.__contains__('encoder') and info['encoder'] in mvGroups:
                setCategory(torrent, 1)
            elif info.__contains__('encoder') and info['encoder'] in audioGroups:
                setCategory(torrent, 2)
            elif info.__contains__('quality'):
                # 来源为原盘的
                if info['quality'] in ['Blu-ray']:
                    # 压制 还是 原盘
                    if re.search(r'\Wx265\W|\Wx264\W', torrent.name, re.I):
                        setCategory(torrent, 3)
                    elif re.search(r'\WREMUX\W', torrent.name, re.I):
                        setCategory(torrent, 4)
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

if __name__ == "__main__":
    qbAutoCategory()