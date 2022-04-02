import os
import re
import argparse


def loadArgs():
    parser = argparse.ArgumentParser(
        description='renep: rename EP0x --> E0x.')
    parser.add_argument('MEDIA_DIR',
                        help='The directory contains media files.')
    parser.add_argument('--dryrun',
                        action='store_true',
                        help='print message instead of real rename.')

    global ARGS
    ARGS = parser.parse_args()
    ARGS.MEDIA_DIR = os.path.expanduser(ARGS.MEDIA_DIR)


def moveEp2E(foldername):
    for fn in os.listdir(foldername):
        print('>>> ' + fn)
        m = re.search(r'\b(S\d+)?Ep(\d+)\b', fn, flags=re.I)
        if m:
            epnum = m.group(2)
            newfn = re.sub(r'Ep(\d+)\b', 'E'+epnum, fn, flags=re.I)
            print('mv ', fn, newfn)
            if not ARGS.dryrun:
                os.rename(os.path.join(foldername, fn), os.path.join(foldername, newfn))


def main():
    loadArgs()
    mvLocation = ARGS.MEDIA_DIR
    mvLocation = os.path.abspath(mvLocation)
    moveEp2E(mvLocation)


if __name__ == '__main__':
    main()
