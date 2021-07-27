#!/usr/bin/python3

hostname = ''
qb_username = ''
qb_password = ''

from qbittorrentapi import Client
client = Client(host=hostname , username=qb_username , password=qb_password)

torrent_list = client.torrents.info()

for torrent in torrent_list:
    for status in torrent.trackers:
        if 'unregistered torrent' in status.msg:
            print(torrent.name,' ',status.msg)
            torrent.pause(hash=(torrent.hash))
            torrent.resume(hash=(torrent.hash))