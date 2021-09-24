// ==UserScript==
// @name         保种组统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432866
// @version      0.1
// @description  count the size of the seeding PTer torrents.
// @author       ccf2012
// @match        https://pterclub.com/getusertorrentlist.php?userid=*&type=seeding
// @icon         https://pterclub.com/favicon.ico
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// ==/UserScript==

// 油猴中加载后，访问面面： https://pterclub.com/getusertorrentlist.php?userid=12345&type=seeding  
// 其中userid后面的12345改为你的uid

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getSeedList() {
  var seedList = document.querySelectorAll(
    "#outer > table > tbody > tr > td:nth-child(2) > a:nth-child(1)"
  );
  var seedListSize = document.querySelectorAll(
    "#outer > table > tbody > tr > td:nth-child(4)"
  );
  var summary = GM_addElement(
    document.querySelector("#outer > h1"),
    "span",
    {}
  );
  var outputstr = "";
  var countPTer = 0;
  var sizePTer = 0;
  var regex = /[+-]?\d+(\.\d+)?/g;

  for (var i = 0; i < seedList.length; i++) {
    var seedName = seedList[i].title;
    if (seedName.indexOf("PTer") > 0) {
      var seedSizeStr = seedListSize[i + 1].innerText;
      var num = seedSizeStr.match(regex).map(function (v) {
        return parseFloat(v);
      });
      var size = 0;
      if (seedSizeStr.indexOf("KB") > 0) {
        size = num * 1024;
      } else if (seedSizeStr.indexOf("MB") > 0) {
        size = num * 1024 * 1024;
      } else if (seedSizeStr.indexOf("GB") > 0) {
        size = num * 1024 * 1024 * 1024;
      } else if (seedSizeStr.indexOf("TB") > 0) {
        size = num * 1024 * 1024 * 1024 * 1024;
      } else {
        size = num;
      }
      countPTer++;
      sizePTer += size;
      outputstr = outputstr + seedName + " - " + seedSizeStr + "<br>";
    }
  }

  summary.innerHTML =
    "<p>官种数量 " + countPTer + " 官种大小 " + formatBytes(sizePTer) + "<br></p>";
}

(function () {
  "use strict";

  var summaryButton = GM_addElement(
    document.querySelector("#outer > h1"),
    "button",
    {
      id: "summary_seed",
      name: "官种统计",
    }
  );
  summaryButton.innerHTML = "官种统计";
  document.querySelector('button[name="官种统计"]').onclick = function () {
    getSeedList(document);
  };
})();
