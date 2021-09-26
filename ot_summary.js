// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.7
// @description  count the size of the seeding official torrents, support PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt, TTG
// @author       ccf2012
// @match        https://hdsky.me/userdetails.php?id=*
// @match        https://ourbits.club/userdetails.php?id=*
// @match        https://chdbits.co/userdetails.php?id=*
// @match        https://club.hares.top/userdetails.php?id=*
// @match        https://pthome.net/userdetails.php?id=*
// @match        https://www.hddolby.com/userdetails.php?id=*
// @match        https://www.tjupt.org/userdetails.php?id=*
// @match        https://totheglory.im/userdetails.php?id=*
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
    useTitle: true,
    ajaxGet: true,
  },
  "https://pterclub.com": {
    seedList: "#outer > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
    seedListSize: "#outer > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#outer > h1",
    matchRegex: /[@-]\s?(PTer)/i,
    useTitle: true,
    ajaxGet: false,
  },
  "https://ourbits.club": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowfollow",
    matchRegex: /[@-]\s?(Our|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://chdbits.co": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow",
    matchRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://club.hares.top": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowfollow",
    matchRegex: /[@-]\s?(Hares)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://pthome.net": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(17) > td.rowfollow",
    matchRegex: /[@-]\s?(PTH)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://www.hddolby.com": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(17) > td.rowfollow",
    matchRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://www.tjupt.org": {
    seedList: "table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "table > tbody > tr > td:nth-child(3)",
    seedingSummary:
      "table > tbody > tr > td > table > tbody > tr:nth-child(19) > td.rowfollow",
    matchRegex: /[@-]\s?(TJUPT)/i,
    useTitle: true,
    ajaxGet: true,
  },
  "https://totheglory.im": {
    seedList: "#ka2 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka2 > table > tbody > tr > td:nth-child(4)",
    seedingSummary:
      "#main_table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td:nth-child(2)",
    matchRegex: /[@-]\s?(TTG|Wiki|NGB|DoA|ARiN|ExREN)/i,
    useTitle: false,
    ajaxGet: false,
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
    var seedName;
    if (config[window.location.origin].useTitle) seedName = seedList[i].title;
    else seedName = seedList[i].innerText;

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
  if (config[window.location.origin].ajaxGet)
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
      if (window.location.origin == "https://totheglory.im") {
        getSeedList(document);
      } else {
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
      }
    };
  }
})();
