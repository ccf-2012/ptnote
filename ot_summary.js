// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.6.3
// @description  count the size of the seeding official torrents, support PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt
// @author       ccf2012
// @match        https://hdsky.me/userdetails.php?id=*
// @match        https://ourbits.club/userdetails.php?id=*
// @match        https://chdbits.co/userdetails.php?id=*
// @match        https://club.hares.top/userdetails.php?id=*
// @match        https://pthome.net/userdetails.php?id=*
// @match        https://www.hddolby.com/userdetails.php?id=*
// @match        https://www.tjupt.org/userdetails.php?id=*
// @match        https://pterclub.com/userdetails.php?id=*
// @match        https://pterclub.com/getusertorrentlist.php?userid=*&type=seeding
// @icon         https://ourbits.club//favicon.ico
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// ==/UserScript==

var config = {
  "https://hdsky.me": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(6)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow",
    matchRegex: /[@-]\s?(HDS)/i,
  },
  "https://pterclub.com": {
    seedList: "#outer > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
    seedListSize: "#outer > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#outer > h1",
    matchRegex: /[@-]\s?(PTer)/i,
  },
  "https://ourbits.club": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowfollow",
    matchRegex: /[@-]\s?(Our|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
  },
  "https://chdbits.co": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow",
    matchRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN)/i,
  },
  "https://club.hares.top": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowfollow",
    matchRegex: /[@-]\s?(Hares)/i,
  },
  "https://pthome.net": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(17) > td.rowfollow",
    matchRegex: /[@-]\s?(PTH)/i,
  },
  "https://www.hddolby.com": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(17) > td.rowfollow",
    matchRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
  },
  "https://www.tjupt.org": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(19) > td.rowfollow",
    matchRegex: /[@-]\s?(TJUPT)/i,
  },
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getSeedList(seedHtml) {
  var seedList = seedHtml.querySelectorAll(
    config[window.location.origin].seedList
  );
  var seedListSize = seedHtml.querySelectorAll(
    config[window.location.origin].seedListSize
  );
  var summary = GM_addElement(
    document.querySelector(config[window.location.origin].seedingSummary),
    "span",
    {}
  );
  var countOT = 0;
  var sizeOT = 0;
  var regex = /[+-]?\d+(\.\d+)?/g;

  for (var i = 0; i < seedList.length; i++) {
    var seedName = seedList[i].title;
    if (seedName.match(config[window.location.origin].matchRegex)) {
      seedList[i].parentNode.style = "background-color: lightgreen;";
      var seedSizeStr = seedListSize[i + 1].innerText;

      var num = seedSizeStr.match(regex).map(function (v) {
        return parseFloat(v);
      });
      var size = 0;
      if (seedSizeStr.match(/(KB|KiB)/i)) {
        size = num * 1024;
      } else if (seedSizeStr.match(/(MB|MiB)/i)) {
        size = num * 1024 * 1024;
      } else if (seedSizeStr.match(/(GB|GiB)/i)) {
        size = num * 1024 * 1024 * 1024;
      } else if (seedSizeStr.match(/(TB|TiB)/i)) {
        size = num * 1024 * 1024 * 1024 * 1024;
      } else {
        size = num;
      }
      countOT++;
      sizeOT += size;
    }
  }

  summary.innerHTML =
    "<p>官种数量 " + countOT + " 官种大小 " + formatBytes(sizeOT) + "<br></p>";
  if (window.location.origin != "https://pterclub.com")
    summary.innerHTML += seedHtml.innerHTML;
}

(function () {
  "use strict";

  if (window.location.origin == "https://pterclub.com") {
    if (window.location.href.match(/getusertorrentlist/i)) {
      getSeedList(document);
    } else {
      var useridStr = window.location.href.match(
        /\/userdetails.php\?id=(\d+)/i
      )[1];
      // var params = url.split("?")[1].split("&");
      var urlPterTorrentList =
        "https://pterclub.com/getusertorrentlist.php?userid=" +
        useridStr +
        "&type=seeding";

      var summary = GM_addElement(
        document.querySelector("#row_current_seeding"),
        "button",
        {}
      );
      summary.innerHTML = "<a href=" + urlPterTorrentList + ">保种统计</a>";
    }
  } else {
    var sumOtBtn = GM_addElement(
      document.querySelector(config[window.location.origin].seedingSummary),
      "button",
      {
        id: "sumary_ot",
      }
    );
    sumOtBtn.innerHTML = "官种统计";
    var urlTorrentList;

    sumOtBtn.onclick = function () {
      var useridStr = window.location.href.match(
        /\/userdetails.php\?id=(\d+)/i
      )[1];
      urlTorrentList =
        window.location.origin +
        "/getusertorrentlistajax.php?userid=" +
        useridStr +
        "&type=seeding";

      GM.xmlHttpRequest({
        method: "GET",
        url: urlTorrentList,
        onload: function (response) {
          var responseHTML = document.createElement("html");
          responseHTML.innerHTML = response.response;
          getSeedList(responseHTML);
        },
      });
    };
  }
})();
