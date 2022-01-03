import os
import shutil
import argparse
import re
from humanbytes import HumanBytes
from tortitle import parseMovieName


def ensureDir(file_path):
    if os.path.isfile(file_path):
        file_path = os.path.dirname(file_path)
    if not os.path.exists(file_path):
        os.makedirs(file_path)

def sumSize(start_path = '.'):
    # total_size = 0
    # for dirpath, dirnames, filenames in os.walk(start_path):
    #     for f in filenames:
    #         fp = os.path.join(dirpath, f)
    #         # skip if it is symbolic link
    #         if not os.path.islink(fp):
    #             total_size += os.path.getsize(fp)

    total_size = sum(d.stat().st_size for d in os.scandir(start_path) if d.is_file())
    return total_size


def hdlinkCopy(fromLoc, toLoc):
    # destDir = os.path.join(g_args.hd_path, toLoc)
    # ensureDir(destDir)
    if os.path.isdir(fromLoc):
        # destDir = os.path.join(destDir, os.path.basename(fromLoc))
        destDir = toLoc
        if not os.path.exists(destDir):
            print('copytree ', fromLoc, destDir)
            shutil.copytree(fromLoc, destDir, copy_function=os.link)


def loadArgs():
    parser = argparse.ArgumentParser(
        description='ren_cultfilm: a script to rename cultfilm folder.')
    parser.add_argument('MEDIA_DIR', help='The directory contains CultFilm dirs.')

    global g_args
    g_args = parser.parse_args()


def replaceCultFilms(fromDir):
    for movieItem in os.listdir(fromDir):
        if movieItem.endswith('CultFilms™'):
            toDir = re.sub(r'CultFilms™', 'CultFilms', movieItem, flags=re.I)
            movieFullPath = os.path.join(fromDir, movieItem)
            mediaTargeDir = os.path.join(fromDir, toDir)

            if os.path.isdir(movieFullPath):
                parseTitle, parseYear, parseSeason, cntitle = parseMovieName(movieItem)
                sizeStr = HumanBytes(sumSize)
                print('https://<site domain>/torrents.php?searchstr=%s+%s  ( %s ) : %s' % (parseTitle, parseYear, sizeStr, mediaTargeDir))
                hdlinkCopy(movieFullPath, mediaTargeDir)


def main():
    loadArgs()
    cpLocation = g_args.MEDIA_DIR
    cpLocation = os.path.abspath(cpLocation)
    replaceCultFilms(cpLocation)


if __name__ == '__main__':
    # # uncomment this to show rclone messages
    # logging.basicConfig(level=logging.DEBUG)
    main()
