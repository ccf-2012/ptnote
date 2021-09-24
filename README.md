# PT Note
> 一些玩PT时写的脚本，需要的自取自改，风险自负

## 基本环境
1. Anaconda & env
```sh
conda update conda
conda create -n qb python=3.6
conda activate qb
```
2. qbittorrent-api & parse-torrent-title
* https://qbittorrent-api.readthedocs.io/en/latest/index.html
* https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)
* https://github.com/platelminto/parse-torrent-title
```sh 
pip install qbittorrent-api
pip install parse-torrent-title
```
1. VSCode (option)
* https://code.visualstudio.com/docs/languages/python

## 脚本列表
1. tracker_notworking.py, 列出qb中 `未工作` 的种子: qb中经常有一些种子，由于某些原因默默地变成了`未工作`，而在webui中仍然是作种等待上传状态，无法一眼看出来，需要逐一点到种子上看tracker状态才能发现，本脚本用于快速找到这些种子。
2. tracker_replacehttps.py, 修改tracker的 `https` 为 `http`: 发现有一些站tracker为https时会不工作，而在http时正常，这些种子在webui中也是难以一眼找出的，此脚本用于快速列出并进行修改。
3. auto_category.py , 自动分类：Movie 和 TV 在刮削的时候要分开，然后MovieEncode可以emby和nPlayer播放，BDMV的就放单独目录去，到电视上看时可以用。如果你在下载时没有作好分类，那么使用本脚本根据种子名进行快速分类。现在分了 TV, MV, Audio, MovieEncode, MovieRemux, Movie4K, MovieWebdl, MovieWeb4K, MovieBDMV, MovieBDMV4K, Other 这样11类。根据种子命名以及组名进行识别。由于命名经常不规范，分类要靠猜测，所以会有错漏需要手工调整。
4. qbittorrent-auto-reflush，在某些外站可能会出现 irssi 下载种子要比 tracker 更新快的情况，这个脚本可以自动刷新 qbittorrent 出现的 `unregister` 的种子，详细用法请点击文件夹查看。
5. auto_host_tag.py, 自动添加站点标签：根据tracker主机名添加标签，便于在webui中进行查看管理。未工作的tracker会额外添加一个`未工作`标签。
6. pter_seed_size.js, 想着进保种组，发现需要自己统计一下自己保了多少官种，就写了这个脚本。脚本是油猴中使用，加载后，在这个页面：`https://pterclub.com/getusertorrentlist.php?userid=12345&type=seeding` 其中userid后面的12345改为你的uid。然后就会看到有作种统计按钮，点击后显示官种数量和大小。
7. pter_sendbonus.sh 和 send_naitang.sh，分别为在猫站和白兔站批量发送猫粮和奶糖，`...用户名...`替换为你要送的用户username, `...COOKIE...`替换为你猫站或白兔上的Cookie, 发送数量改循环次数

## 自动分类功能的应用设想
* 使用PT的过程中，人们非常看重保种，pter下载自己准备观看的片子，并在之后一段时间内维持在下载器中作种，对于站点和个人后续的使用来说都是有益的。所以，同时在下载器中和媒体服务器（如Emby）的媒体库目录中，对所下载的文件保持有序的管理，是有意义的。
* 幸运的是，QB提供了分类（Category）和存储目录（Save Location）的管理功能，并提供了api，所以这里写了一些脚本，以方便地在QB中维护所下载的文件。

* 设想的使用场景是这样子，如果是初次使用：
1. `auto_category.py` 中设置好QB：
   1. QB下载器的ip, 端口，用户名，密码，`QB_PARAM`
   2. QB下载器的下载目录，`QB_ROOT`，**注意这里绝对不能写错**
2. 如果你已经有一些分类作好了维护，不希望对它们作重新分类，请设置`skipCategories`
3. 初次使用`auto_category.py`时，`setCategory` 函数中先不要把执行分类的语句注释拿掉，运行一次看看输出，如果对结果满意再拿掉注释，再次运行使分类和目录搬移生效。
4. 还有个 `auto_host_tag.py` 脚本，可以将tracker主机名提取出来作标签，方便在QB中归类管理，这个基本就没有什么风险。

* 如果已经对现有几千个种子跑过一次脚本，日常还在不断手动添加种子或开着flexget，那么可以：
1. 设置一个独立的分类名，比如 `NEW` (或 `RSS` 或别的你喜欢的名字)，新加的种子，添加到这个分类中（在flexget中可以简单地设置这个分类）
2. 修改`auto_category.py`和`auto_host_tag.py`的这一行，使操作局限在`NEW`这个分类的种子
```py
for torrent in qbt_client.torrents_info(sort='name', category='NEW')
```
3. 手工或者你喜欢的方式，运行 `auto_category.py`和`auto_host_tag.py`这两个脚本

