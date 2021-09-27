// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.8
// @description  count the size of the seeding official torrents, support PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt, TTG, HDH, ???, HDC
// @author       ccf2012
// @match        https://hdsky.me/userdetails.php?id=*
// @match        https://ourbits.club/userdetails.php?id=*
// @match        https://chdbits.co/userdetails.php?id=*
// @match        https://club.hares.top/userdetails.php?id=*
// @match        https://*.pthome.net/userdetails.php?id=*
// @match        https://*.hddolby.com/userdetails.php?id=*
// @match        https://*.tjupt.org/userdetails.php?id=*
// @match        https://totheglory.im/userdetails.php?id=*
// @match        https://hdhome.org/userdetails.php?id=*
// @match        https://hdchina.org/userdetails.php?id=*
// @match        https://那谁谁.net/userdetails.php?id=*
// @match        https://pterclub.com/userdetails.php?id=*
// @icon         https://ourbits.club//favicon.ico
// @grant        GM_addElement
// @grant        GM_addStyle
// ==/UserScript==

var config = {
  "hdsky.me": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(6)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(HDS)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "pterclub.com": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1",
    matchRegex: /[@-]\s?(PTer)/i,
    useTitle: true,
    isAjaxGet: false,
  },
  "ourbits.club": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(Our|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "chdbits.co": {
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "club.hares.top": {
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(Hares)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "pthome.net": {
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(PTH)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "那谁谁.net": {
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(CMCT)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "hdhome.org": {
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(HDH)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "hdchina.org": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > p",
    matchRegex: /[@-]\s?(HDC|k9611|tudou|iHD)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "hddolby.com": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "tjupt.org": {
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    matchRegex: /[@-]\s?(TJUPT)/i,
    useTitle: true,
    isAjaxGet: true,
  },
  "totheglory.im": {
    seedList: "#ka2 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka2 > table > tbody > tr > td:nth-child(4)",
    seedingSummary:
      "#main_table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td:nth-child(2)",
    matchRegex: /[@-]\s?(TTG|Wiki|NGB|DoA|ARiN|ExREN)/i,
    useTitle: false,
    isAjaxGet: false,
  },
};

config["www.tjupt.org"] = config["tjupt.org"];
config["www.hddolby.com"] = config["hddolby.com"];
config["www.pthome.net"] = config["pthome.net"];

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
    config[window.location.host].seedList
  );
  var seedListSize = seedHtml.querySelectorAll(
    config[window.location.host].seedListSize
  );

  var countOT = 0;
  var sizeOT = 0;
  var regex = /[+-]?\d+(\.\d+)?/g;
  for (var i = 0; i < seedList.length; i++) {
    var seedName;
    if (config[window.location.host].useTitle) seedName = seedList[i].title;
    else seedName = seedList[i].innerText;

    if (seedName.match(config[window.location.host].matchRegex)) {
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

  var summary = document.querySelector(config[window.location.host].seedingSummary);
  summary.innerHTML = 
    "<p>官种数量 " + countOT + " 官种大小 " + formatBytes(sizeOT) + "<br></p>" + summary.innerHTML ;
}

(function () {
  "use strict";

  if (window.location.host == "totheglory.im") {
    getSeedList(document);
  } else {
    var intv = setInterval(function() {
      var elems = document.querySelectorAll('#ka1 > table > tbody > tr');
      if (elems && elems.length <  1){
            return false;
      }
      //when element is found, clear the interval.
      clearInterval(intv);
      // alert("loaded.");
      getSeedList(document);
    }, 1000);
  }
})();
