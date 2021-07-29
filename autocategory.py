import qbittorrentapi
import urllib.parse
import re
import PTN

# qb的 ip地址, port，登陆帐号密码，自行修改
QB_PARAM = {
    'host': '192.168.1.8',
    'port': 8189,
    'username': 'admin',
    'password': 'adminadmin'
}
# 注意qb的存储位置
QB_ROOT = '/Downloads/'
# 分了这样 8 类，后面数字是输出字符的颜色，真改之前方便检查
CATEGORIES = {
    'TV': ['TV', '32', 0],
    'MV': ['MV', '31', 0],
    'Audio': ['Audio', '34', 0],
    'MovieEncode': ['MovieEncode', '36', 0],
    'MovieRemux': ['MovieRemux', '36', 0],
    'Movie4K': ['Movie4K', '36', 0],
    'MovieWebdl': ['MovieWebdl', '36', 0],
    'MovieWeb4K': ['MovieWeb4K', '36', 0],
    'MovieBDMV': ['MovieBDMV', '35', 0],
    'MovieBDMV4K': ['MovieBDMV4K', '35', 0],
    'Other': ['Other', '33', 0]
}


def setCategory(torrent, catstr):
    CATEGORIES[catstr][2] += 1
    print(
        f'{CATEGORIES[catstr][0]}: \033[{CATEGORIES[catstr][1]}m{torrent.name}\033[0m ({torrent.state})')
    # 真要修改，就去掉下面的注释
    # torrent.setCategory(CATEGORIES[catstr][0])
    # 要一并修改磁盘上存储的位置就把下面注释拿掉，一定抬头看一下上面的QB_ROOT的位置
    # torrent.setLocation(QB_ROOT+CATEGORIES[catstr][0])
    return


def qbAutoCategory(qbt_client):
    # 如果有些分类已经设好，不想重新识别分类的放在 skipCategories
    skipCategories = ['儿童剧集', '儿童', 'Music', 'Audio']
    # 有些组生产 TV Series，但是在种子名上不显示 S01 这些
    tvGroups = ['CMCTV',  'FLTTH']
    # 有些Web组，即生产TV又生产Movie，种子名上又不显示，得看文件
    webGroups = ['CHDWEB', 'PTerWEB', 'HaresWEB', 'DBTV', 'QHStudio',
                 'LeagueWEB', 'HDCTV', '52KHD', 'PTHweb', 'OurTV', 'iLoveTV']
    # 有些组专门生产 MV
    mvGroups = ['PterMV']
    # 有些组专门生产 Audio
    audioGroups = ['PTHAudio']
    # 有些组专门作压制，但是不在种子名上标记
    movieEncodeGroup = 'CMCT'

    for torrent in qbt_client.torrents_info(sort='name'):
        # 注意，所有torrent都会设为 **非自动** 管理，否则修改了分类将引发文件搬移
        torrent.use_auto_torrent_management = False

        if torrent.category not in skipCategories:
            info = PTN.parse(torrent.name)
            # 有season和episode 或 专作TV的Group
            if info.__contains__('season') or info.__contains__('episode') or \
                    (info.__contains__('encoder') and info['encoder'] in tvGroups):
                setCategory(torrent, 'TV')
            elif re.search(r'S0\d\W|\d季|第\w{1,3}季\W', torrent.name, re.I):
                setCategory(torrent, 'TV')
            elif re.search(r'\Wcomplete\W|全\d+集|\d+集全', torrent.name, re.I):
                setCategory(torrent, 'TV')
            elif info.__contains__('encoder') and info['encoder'] in webGroups:
                ### TODO: 取出里面的文件名进行parse检查
                if len(torrent.files) > 4:
                    setCategory(torrent, 'TV')
            elif info.__contains__('encoder') and info['encoder'] in mvGroups:
                setCategory(torrent, 'MV')
            elif info.__contains__('encoder') and info['encoder'] in audioGroups:
                setCategory(torrent, 'Audio')
            elif info.__contains__('quality'):
                # 来源为原盘的
                if info['quality'] in ['Blu-ray']:
                    # Remux, 压制 还是 原盘
                    if re.search(r'\WREMUX\W', torrent.name, re.I):
                        if info.__contains__('resolution') and info['resolution'] == '2160p':
                            setCategory(torrent, 'Movie4K')
                        else:
                            setCategory(torrent, 'MovieRemux')
                    elif re.search(r'\Wx265\W|\Wx264\W', torrent.name, re.I):
                        if info.__contains__('resolution') and info['resolution'] == '2160p':
                            setCategory(torrent, 'Movie4K')
                        else:
                            setCategory(torrent, 'MovieEncode')
                    else:
                        if info.__contains__('resolution') and info['resolution'] == '2160p':
                            setCategory(torrent, 'MovieBDMV4K')
                        else:
                            setCategory(torrent, 'MovieBDMV')
                # 来源是 WEB-DL
                elif info['quality'] in ['WEB-DL']:
                    if info.__contains__('resolution') and info['resolution'] == '2160p':
                        setCategory(torrent, 'MovieWeb4K')
                    else:
                        setCategory(torrent, 'MovieWebdl')
            elif info.__contains__('encoder') and info['encoder'].find(movieEncodeGroup):
                setCategory(torrent, 'MovieEncode')
            else:
                setCategory(torrent, 'Other')

    mvSum = 0
    for cat in CATEGORIES.keys():
        print(f'{CATEGORIES[cat][0]} : {CATEGORIES[cat][2]}')
        mvSum += CATEGORIES[cat][2]
    print(f'Total : {mvSum}')


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
