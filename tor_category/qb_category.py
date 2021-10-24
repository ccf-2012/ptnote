import qbittorrentapi
import urllib.parse
import re
import PTN

# qb的 ip地址, port，登陆帐号密码，自行修改
QB_PARAM = {
    'host': '192.168.5.8',
    'port': 8189,
    'username': 'admin',
    'password': 'adminadmin'
}
# 注意qb的存储位置
QB_ROOT = '/Downloads/'
# QB_ROOT = '/Downloads/'

# 分了这样 11 类，后面数字是输出字符的颜色，真改之前方便检查
CATEGORIES = {
    'TV': ['TV', '32', 0],
    'MV': ['MV', '31', 0],
    'Audio': ['Audio', '34', 0],
    'MovieEncode': ['MovieEncode', '36', 0],  # 压制 1080p and lower, 适合emby
    'MovieRemux': ['MovieRemux', '36', 0],    # Remux 1080p and lower, 适合emby
    'Movie4K': ['Movie4K', '36', 0],          # 压制和Remux 4K，适合emby
    'MovieWebdl': ['MovieWebdl', '36', 0],    # Web DL，适合emby
    'MovieWeb4K': ['MovieWeb4K', '36', 0],    # Web DL，适合emby
    'MovieBDMV': ['MovieBDMV', '35', 0],      # 原盘, 适合播放机 & kodi
    'MovieBDMV4K': ['MovieBDMV4K', '35', 0],  # 原盘 4K, 适合播放机 & kodi
    'Other': ['Other', '33', 0]
}


def setCategory(torrent, catstr):
    CATEGORIES[catstr][2] += 1
    print(
        f'{CATEGORIES[catstr][0]}: \033[{CATEGORIES[catstr][1]}m{torrent.name}\033[0m ({torrent.state})')

    # 真要修改，就去掉下面的注释
    torrent.setCategory(CATEGORIES[catstr][0])
    # 设置自动管理后会移动文件
    torrent.setAutoManagement(True)

    # 另一种方法，似乎不如直接设置自动管理好，暂存这里
    # 要一并修改磁盘上存储的位置就把下面注释拿掉，一定抬头看一下上面的QB_ROOT的位置
    # 由于同一位置会有多站辅种，有概率会导致一些站点设置存储位置后重新校验，风险预警
    # torrent.setLocation(QB_ROOT+CATEGORIES[catstr][0])
    return


def qbInitCategory(qbt_client):
    cats = qbt_client.torrents_categories()
    for cat in CATEGORIES.items():
        if not cats.get(cat[0], None):
            qbt_client.torrents_create_category(cat[0], QB_ROOT+cat[0])


def qbAutoCategory(qbt_client):
    # 如果有些分类已经设好，不想重新识别分类的放在 skipCategories
    skipCategories = ['儿童剧集', '儿童', 'Child', 'ChildTV', 'Music',
                      'Audio', 'Document', 'PACK', 'MySeed', 'Foreigns', 'FRDS', 'SGNB']
    # 有些组生产 TV Series，但是在种子名上不显示 S01 这些
    tvGroups = ['CMCTV',  'FLTTH']
    # 有些Web组，即生产TV又生产Movie，种子名上又不显示，得看文件
    webGroups = ['CHDWEB', 'PTERWEB', 'HARESWEB', 'DBTV', 'QHSTUDIO',
                 'LEAGUEWEB', 'HDCTV', '52KHD', 'PTHWEB', 'OURTV', 'ILOVETV']
    # 有些组专门生产 MV
    mvGroups = ['PTERMV', 'MELON', 'BUGS!']
    # 有些组专门生产 Audio
    audioGroups = ['PTHAUDIO']
    # 有些组专门作压制，但是不在种子名上标记
    movieEncodeGroup = ['CMCT', 'FRDS']

    for torrent in qbt_client.torrents_info(sort='name', category='NEW'):
        # for torrent in qbt_client.torrents.info(sort='name'):
        # 注意，所有torrent都会设为 **非自动** 管理，否则修改了分类将引发文件搬移
        # torrent.use_auto_torrent_management = False
        torrent.setAutoManagement(False)

        if torrent.category not in skipCategories:
            info = PTN.parse(torrent.name)
            # encoder 先预处理一下
            if info.__contains__('encoder'):
                teamstr = info['encoder'].strip().upper()
                if teamstr.find('.') > 0:
                    teamstr = teamstr.split('.')[0]
                if teamstr.find('@') > 0:
                    teamstr = teamstr.split('@')[1]
            else:
                teamstr = ''

            # MV 也会有 episode，要先按group分掉
            if info.__contains__('encoder') and teamstr in mvGroups:
                setCategory(torrent, 'MV')
            elif info.__contains__('encoder') and teamstr in audioGroups:
                setCategory(torrent, 'Audio')
            # 有season和episode 或 专作TV的Group
            elif info.__contains__('season') or info.__contains__('episode') or \
                    (info.__contains__('encoder') and teamstr in tvGroups):
                setCategory(torrent, 'TV')
            elif re.search(r'S0\d\W|\d季|第\w{1,3}季\W', torrent.name, re.I):
                setCategory(torrent, 'TV')
            elif re.search(r'\Wcomplete\W|全\d+集|\d+集全', torrent.name, re.I):
                setCategory(torrent, 'TV')
            elif info.__contains__('encoder') and teamstr in webGroups:
                ### TODO: 偷懒了
                if len(torrent.files) > 4:
                    setCategory(torrent, 'TV')
                else:
                    setCategory(torrent, 'MovieWebdl')
            # 非web组出的
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
                else:
                    # 有quality参数，但是不是Blu-ray也不是WEB-DL，就Other了吧
                    setCategory(torrent, 'Other')
            # TV/MV/Audio都匹配不上，quality没标记，就按组猜了
            elif info.__contains__('encoder'):
                for ts in movieEncodeGroup:
                    if teamstr.find(ts):
                        setCategory(torrent, 'MovieEncode')
            elif re.search('￡CMCT', torrent.name, re.I):
                setCategory(torrent, 'MovieEncode')
            else:
                # Other的条件： TV/MV/Audio都匹配不上，quality没标记，各种压制组也对不上
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

    # 第一次运行把下面注释拿掉
    qbInitCategory(qbt_client)

    qbAutoCategory(qbt_client)


if __name__ == '__main__':
    main()
