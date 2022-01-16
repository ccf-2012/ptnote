# 外站辅种笔记

## 概述
* 外站通常提供api进行种子搜索，需要通过[Jackett](https://github.com/Jackett/Jackett)这样的包装进行访问。
* Jackett之外，还需要一个在本地种子/文件中找匹配的脚本。这里试过两个：
  * cross-seed: https://github.com/mmgoodnow/cross-seed
  * Cross-Seed-AutoDL: https://github.com/BC44/Cross-Seed-AutoDL

以下是太长不看笔记：
> 其中的`192.168`开头的主机地址，以及`/volume1`和`/home/ccf2012/`开头的目录名都是要改的，你知道的吧

## Jackett 安装
* https://github.com/Jackett/Jackett

### 群晖上以Docker安装
* `ssh` 到群晖上
* `sudo -i` 为root
* 编辑一个 `docker-compose.yml`
```yml
version: "2.1"
services:
  jackett:
    image: lscr.io/linuxserver/jackett
    container_name: jackett
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - AUTO_UPDATE=true
    volumes:
      - /volume1/docker/jackett:/config
      - /volume1/video/jackdownloads:/downloads
    ports:
      - 9117:9117
    restart: unless-stopped
```
* 然后启动
```sh 
docker-compose up -d
```

### Linux上安装
* 以普通用户操作就好
> 这是2022.1.15的下载地址
```sh
wget https://github.com/Jackett/Jackett/releases/download/v0.20.285/Jackett.Binaries.LinuxAMDx64.tar.gz
tar xvzf Jackett.Binaries.LinuxAMDx64.tar.gz
cd Jackett
```
* 直接开tmux或screen以命令行启动就好
```sh
./jackett
```

* (option) 也可以开服务运行，`su`为root后
```sh 
./install_service_systemd.sh
systemctl start jackett.service
```

### 运行Jackett
* 开起来后，以 `http://<your-ip>:9117` 连接查看
* 注意安装好的Jackett会有一个自己的 Api key, 记下来，替换后面的`<jackett api-key>`
* `Add Indexer`, 到外站，通常是个人 `Security` 页面上，找 `API Key` 填写


## Cross-Seed-AutoDL
* https://github.com/BC44/Cross-Seed-AutoDL

### Linux上安装依赖库
```sh
pip3 install -r requirements.txt
```

### 群晖上使用
* 群晖需要有python3环境
* 群晖安装pip
```sh
python3 -m ensurepip
```
* 群晖安装依赖库
```sh
cd Cross-Seed-AutoDL
python3 -m pip install -r requirements.txt
```

### 运行辅种脚本
```sh
python3 CrossSeedAutoDL.py -p -i "/volume1/video/downloads/" -s "/volume1/video/tors" -u "http://192.168.5.6:9117" -k "<jackett api-key>" 
```
* 下载的torrent 文件保存在上面 `-s` 指向的目录
  

## cross-seed
* https://github.com/mmgoodnow/cross-seed

### 安装Node.js
* https://github.com/nodesource/distributions/blob/master/README.md
```sh
# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
apt-get install -y nodejs
```

### 运行cross-seed

```sh
npx cross-seed search \
  --jackett-server-url http://192.168.5.6:9117 \
  --jackett-api-key <jackett api-key> \
  --torrent-dir /home/ccf2012/.config/deluge/state \
  --output-dir /tmp/torrents
```

## 特别提醒
1. CrossSeedAutoDL是提取了文件名的中的影视标题，拿去给api搜的，所以不同组，大小差不多的，都会下回来
2. 放进下载器前，一定一定设置：
   1. transmission: `自动开始新添加的种子` 不打勾 
   2. Deluge: `Add torrents in Paused state` 打勾
   3. qbittorrent: `不要自动开始下载` 打勾
3. 即使组相同版本相同，也会有一些文件名上的细微不同，需要自己小心处理，如：
   1. `FraMeSToR` 组的，不同外站，有的是在目录中的，有的是单文件的
   2. `CultFilms™` 组的，在一些站上是改为 `CultFilms` 
   3. 还有的带nfo的，有的不带
