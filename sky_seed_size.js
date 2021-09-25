// ==UserScript==
// @name         保种组统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432866
// @version      0.4
// @description  count the size of the seeding HDSky torrents.
// @author       ccf2012
// @match        https://hdsky.me/userdetails.php?id=*
// @icon         https://hdsky.me/favicon.ico
// @grant        GM_addElement
// @grant        GM.xmlHttpRequest
// ==/UserScript==

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  
  function getSeedList(seedHtml) {
    var seedList = seedHtml.querySelectorAll("table > tbody > tr > td:nth-child(2) > a > b");
    var seedListSize = seedHtml.querySelectorAll("table > tbody > tr > td:nth-child(6)");
    var summary = GM_addElement(
      document.querySelector("#outer > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td.rowfollow"),
      // document.querySelector("#outer > table.main > tbody > tr > td > table > tbody > tr:nth-child(18) > td.rowhead.nowrap"),
      "span",
      {}
    );
    var countPTer = 0;
    var sizePTer = 0;
    var regex = /[+-]?\d+(\.\d+)?/g;
    
    for (var i = 0; i < seedList.length; i++) {
      var seedName = seedList[i].innerText;
      if (seedName.match(/[@-](HDS|HDTV)/i)) {
        // var pterTag = GM_addElement(seedList[i], "a", {
        //   class: "tag tag-jz",
        //   style: "margin-left: 2px;",
        //   textContent: "官种",
        // });
        var seedSizeStr = seedListSize[i].innerText;
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
      }
    }
  
    summary.innerHTML =
      "<p>官种数量 " +
      countPTer +
      " 官种大小 " +
      formatBytes(sizePTer) +
      "<br></p>";
  }
  
  (function () {
    "use strict";
  
    var useridStr = window.location.href.match(/\/userdetails.php\?id=(\d+)/i)[1];
    var urlTorrentList =
      "https://hdsky.me/getusertorrentlistajax.php?userid=" +
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
  })();
  