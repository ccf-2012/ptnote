from transmission_rpc import Client
import re
import PTN
import yaml
import os

TRCAT_CONFIG = 'trcat_config.yaml'

TR_ROOT = '/volume2/video/tr'
REAL_MOVE = False

# 如果有些分类已经设好，不想重新识别分类的放在 skipCategories
skipCategories = ['儿童剧集', '儿童', 'Child', 'ChildTV', 'Music',
                  'Audio', 'Document', 'PACK', 'MySeed', 'Foreigns', 'FRDS', 'SGNB']
# 有些组生产 TV Series，但是在种子名上不显示 S01 这些
tvGroups = ['CMCTV',  'FLTTH']
# 有些组专门生产 MV
mvGroups = ['PTERMV', 'MELON', 'BUGS!']
# 有些组专门生产 Audio
audioGroups = ['PTHAUDIO']
# 有些组专门作压制，但是不在种子名上标记
movieEncodeGroup = ['CMCT', 'FRDS']

# 分了这样 13 类，后面数字是输出字符的颜色，真改之前方便检查
CATEGORIES = {
    'TV': ['TV', '32', 0, 'TV'],
    'MV': ['MV', '31;1', 0, 'MV'],
    'Audio': ['Audio', '32;1', 0, 'Audio'],
    'Music': ['Music', '31', 0, 'Music'],
    'eBook': ['eBook', '34', 0, 'eBook'],
    # 压制 1080p and lower, 适合emby
    'MovieEncode': ['MovieEncode', '36', 0, 'MovieEncode'],
    # Remux 1080p and lower, 适合emby
    'MovieRemux': ['MovieRemux', '36', 0, 'MovieRemux'],
    'Movie4K': ['Movie4K', '36', 0, 'Movie4K'],          # 压制和Remux 4K，适合emby
    'MovieWebdl': ['MovieWebdl', '36', 0, 'MovieWebdl'],    # Web DL，适合emby
    'MovieWeb4K': ['MovieWeb4K', '36', 0, 'MovieWeb4K'],    # Web DL，适合emby
    'MovieBDMV': ['MovieBDMV', '35', 0, 'MovieBDMV'],      # 原盘, 适合播放机 & kodi
    # 原盘 4K, 适合播放机 & kodi
    'MovieBDMV4K': ['MovieBDMV4K', '35', 0, 'MovieBDMV4K'],
    'Other': ['Other', '33', 0, 'Others']
}


def setCategory(torrent, category):
    CATEGORIES[category][2] += 1
    categoryDir = TR_ROOT + '/' + CATEGORIES[category][3]
    print(
        f'{CATEGORIES[category][0]}: \033[{CATEGORIES[category][1]}m{torrent.name}\033[0m ({categoryDir})')
    if REAL_MOVE:
        torrent.move_data(categoryDir)
        torrent.locate_data(categoryDir)


def categoryByExt(torrent):
    if re.search(r'(pdf|epub|mobi|txt|chm|azw3|CatEDU|eBook-\w{4,8}|mobi|doc|docx).?$', torrent.name, re.I):
        setCategory(torrent, 'eBook')
    elif re.search(r'\.(mpg)\b', torrent.name, re.I):
        setCategory(torrent, 'MV')
    elif re.search(r'\b(FLAC|DSD(\d{1,3})?)$', torrent.name, re.I):
        setCategory(torrent, 'Music')
    else:
        return False
    return True


def categoryByKeyword(torrent):
    if re.search(r'(上下册|全.{1,4}册|精装版|修订版|第\d版|共\d本|文集|新修版|PDF版|课本|课件|出版社)', torrent.name, re.I):
        setCategory(torrent, 'eBook')
    elif re.search(r'(\d+册|\d+期|\d+版|\d+本|\d+年|\d+月|系列|全集|作品集).?$', torrent.name, re.I):
        setCategory(torrent, 'eBook')
    elif re.search(r'(\bConcert|演唱会|音乐会|\bLive[. ]At)\b', torrent.name, re.I):
        setCategory(torrent, 'MV')
    elif re.search(r'\bBugs!.?\.mp4', torrent.name, re.I):
        setCategory(torrent, 'MV')
    elif re.search(r'(\bVarious Artists|FLAC|\bMQA\b|整轨|分轨|XRCD\d{1,3})\b', torrent.name, re.I):
        setCategory(torrent, 'Music')
    elif re.search(r'(\d ?CD|24-96|SACD).?$', torrent.name, re.I):
        setCategory(torrent, 'Music')
    elif re.search(r'(乐团|交响曲|协奏曲|二重奏)', torrent.name, re.I):
        setCategory(torrent, 'Music')
    else:
        return False
    return True


def categoryTvByName(torrent, ptnInfo):
    if re.search(r'S0\d\W|\d季|第\w{1,3}季\W', torrent.name, re.I):
        setCategory(torrent, 'TV')
    elif re.search(r'\Wcomplete\W|全\d+集|\d+集全', torrent.name, re.I):
        setCategory(torrent, 'TV')
    elif ptnInfo.__contains__('season') or ptnInfo.__contains__('episode'):
        setCategory(torrent, 'TV')
    else:
        return False
    return True


def categoryByGroup(torrent, group):
    if group in mvGroups:
        setCategory(torrent, 'MV')
    elif group in audioGroups:
        setCategory(torrent, 'Audio')
    elif group in tvGroups:
        setCategory(torrent, 'TV')
    elif group in movieEncodeGroup:
        setCategory(torrent, 'MovieEncode')
    else:
        return False
    return True


def parseGroup(torName):
    match = re.search(r'[@\-￡]\s?(\w{3,12})\b(?!.*[@\-￡])', torName, re.I)
    if match:
        groupName = match.group(1).strip().upper()
        if groupName.startswith('CMCT'):
            if not groupName.startswith('CMCTV'):
                groupName = 'CMCT'
        return groupName

    return None


def categoryByQuality(torrent, ptnInfo):
    if ptnInfo.__contains__('quality'):
        # 来源为原盘的
        if ptnInfo['quality'] in ['Blu-ray']:
            # Remux, 压制 还是 原盘
            if re.search(r'\WREMUX\W', torrent.name, re.I):
                if ptnInfo.__contains__('resolution') and ptnInfo['resolution'] == '2160p':
                    setCategory(torrent, 'Movie4K')
                else:
                    setCategory(torrent, 'MovieRemux')
            elif re.search(r'\b(x265|x264)\b', torrent.name, re.I):
                if ptnInfo.__contains__('resolution') and ptnInfo['resolution'] == '2160p':
                    setCategory(torrent, 'Movie4K')
                else:
                    setCategory(torrent, 'MovieEncode')
            else:
                if ptnInfo.__contains__('resolution') and ptnInfo['resolution'] == '2160p':
                    setCategory(torrent, 'MovieBDMV4K')
                else:
                    setCategory(torrent, 'MovieBDMV')
        # 来源是 WEB-DL
        elif ptnInfo['quality'] in ['WEB-DL']:
            if ptnInfo.__contains__('resolution') and ptnInfo['resolution'] == '2160p':
                setCategory(torrent, 'MovieWeb4K')
            else:
                setCategory(torrent, 'MovieWebdl')
        else:
            return False
        return True
    return False


def categoryTorrent(torrent):
    if categoryByExt(torrent):
        return True

    info = PTN.parse(torrent.name)
    if categoryTvByName(torrent, info):
        return True
    group = parseGroup(torrent.name)
    if categoryByGroup(torrent, group):
        return True

    if categoryByKeyword(torrent):
        return True

    # 非web组出的
    if categoryByQuality(torrent, info):
        return True
    else:
        # Other的条件： TV/MV/Audio都匹配不上，quality没标记，各种压制组也对不上
        setCategory(torrent, 'Other')
        return False


def inSkipCategory(torDir):
    for skipCat in skipCategories:
        if torDir == TR_ROOT + '/' + skipCat:
            return True
    return False


def loadConfig():
    global TR_ROOT, REAL_MOVE, skipCategories
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    with open(os.path.join(__location__, TRCAT_CONFIG),'r', encoding="utf-8") as f:
        ymldata = yaml.safe_load(f)

    TR_ROOT = ymldata["rootdir"]
    REAL_MOVE = ymldata["realmove"]
    skipCategories = ymldata["skipdir"]
    return ymldata["transmission"]


def main():
    trConfig = loadConfig()
    c = Client(host=trConfig['host'], port=trConfig['port'],
               username=trConfig['username'], password=trConfig['password'])

    # tor1 = c.get_torrent(2632, arguments=['id','name', 'downloadDir', 'status'])
    # categoryTorrent(tor1)
    torList = c.get_torrents(arguments=['id', 'name', 'downloadDir', 'status'])
    for tor in torList:
        # tor.locate_data(TR_ROOT)
        # if tor.download_dir.startswith(TR_ROOT+ '/Others'):
        if not inSkipCategory(tor.download_dir):
            print(tor.id, tor.name, tor.download_dir)
            categoryTorrent(tor)

    torSum = 0
    for cat in CATEGORIES.keys():
        print(f'{CATEGORIES[cat][0]} : {CATEGORIES[cat][2]}')
        torSum += CATEGORIES[cat][2]
    print(f'Total : {torSum}')


if __name__ == '__main__':
    main()
