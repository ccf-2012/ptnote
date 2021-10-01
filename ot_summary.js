// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.9.0
// @description  Count the seeding torrents, support PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt, TTG, HDH, ???, HDC
// @author       ccf2012
// @source       https://github.com/ccf-2012/ptnote
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
// @match        https://springsunday.net/userdetails.php?id=*
// @match        https://pterclub.com/userdetails.php?id=*
// @icon         https://ourbits.club//favicon.ico
// @grant        GM_addElement
// @grant        GM_addStyle
// ==/UserScript==

const TTG_INDEX = 11;
const OTHERS_INDEX = 14;
var config = [
  {
    host : "hdsky.me",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(HDS)/i,
    groups: [
      { 
        groupName: 'HDSky',
        groupRegex : /[@-]\s?(HDSky)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      { 
        groupName: 'HDS',
        groupRegex : /[@-]\s?(HDS)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDSWEB',
        groupRegex: /[@-]\s?(HDSWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDSTV',
        groupRegex: /[@-]\s?(HDSTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDSPad',
        groupRegex: /[@-]\s?(HDSPad)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'Others',
        groupRegex: /[@-]\s?(HDS)\w./i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "pterclub.com",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1",
    siteRegex: /[@-]\s?(PTer)/i,
    groups: [
      { 
        groupName: 'PTer',
        groupRegex : /[@-]\s?(PTer)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTerWEB',
        groupRegex: /[@-]\s?(PTerWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTerMV',
        groupRegex: /[@-]\s?(PTerMV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTerTV',
        groupRegex: /[@-]\s?(PTerTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "ourbits.club",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Our|PbK|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
    groups: [
      { 
        groupName: 'OurBits',
        groupRegex : /[@-]\s?(OurBits)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'OurTV',
        groupRegex: /[@-]\s?(OurTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FLTTH',
        groupRegex: /[@-]\s?(FLTTH)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'Ao',
        groupRegex: /[@-]\s?(Ao)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PbK',
        groupRegex: /[@-]\s?(PbK)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'MGs',
        groupRegex: /[@-]\s?(PbK)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'iLoveTV',
        groupRegex: /[@-]\s?(iLoveTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'iLoveHD',
        groupRegex: /[@-]\s?(iLoveHD)\b/i,
        groupCount: 0,
        groupSize: 0,
      }      
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "chdbits.co",
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN|OneHD)/i,
    groups: [
      { 
        groupName: 'CHD',
        groupRegex : /[@-]\s?(CHD)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CHDBits',
        groupRegex: /[@-]\s?(CHDBits)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CHDTV',
        groupRegex: /[@-]\s?(CHDTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CHDPAD',
        groupRegex: /[@-]\s?(CHDPAD)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CHDWEB',
        groupRegex: /[@-]\s?(CHDWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CHDHKTV',
        groupRegex: /[@-]\s?(CHDHKTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'StBOX',
        groupRegex: /[@-]\s?(StBOX)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'OneHD',
        groupRegex: /[@-]\s?(OneHD)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "club.hares.top",
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Hares)/i,
    groups: [
      { 
        groupName: 'Hares',
        groupRegex : /[@-]\s?(Hares)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HaresWEB',
        groupRegex: /[@-]\s?(HaresWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HaresTV',
        groupRegex: /[@-]\s?(HaresTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "pthome.net",
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(PTH)/i,
    groups: [
      { 
        groupName: 'PTHome',
        groupRegex : /[@-]\s?(PTHome)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTH',
        groupRegex: /[@-]\s?(PTH)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTHweb',
        groupRegex: /[@-]\s?(PTHweb)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTHtv',
        groupRegex: /[@-]\s?(PTHtv)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTHeBook',
        groupRegex: /[@-]\s?(PTHeBook)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'PTHAudio',
        groupRegex: /[@-]\s?(PTHAudio)\b/i,
        groupCount: 0,
        groupSize: 0,
      },     
      {
        groupName: 'PTHmusic',
        groupRegex: /[@-]\s?(PTHmusic)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
    ],    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "springsunday.net",
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(CMCT)/i,
    groups: [
      { 
        groupName: 'CMCT',
        groupRegex : /[@-]\s?(CMCT)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'CMCTV',
        groupRegex: /[@-]\s?(CMCTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "hdhome.org",
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(HDH)/i,
    groups: [
      { 
        groupName: 'HDHome',
        groupRegex : /[@-]\s?(HDHome)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDH',
        groupRegex: /[@-]\s?(HDH)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDHTV',
        groupRegex: /[@-]\s?(HDHTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDHPad',
        groupRegex: /[@-]\s?(HDHPad)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDHWEB',
        groupRegex: /[@-]\s?(HDHWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "hdchina.org",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > p",
    siteRegex: /[@-]\s?(HDC|k9611|tudou|iHD)/i,
    groups: [
      { 
        groupName: 'HDC',
        groupRegex : /[@-]\s?(HDC)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'k9611',
        groupRegex: /[@-]\s?(k9611)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'tudou',
        groupRegex: /[@-]\s?(tudou)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'iHD',
        groupRegex: /[@-]\s?(iHD)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "hddolby.com",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
    groups: [
      { 
        groupName: 'Dream',
        groupRegex : /[@-]\s?(Dream)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'DBTV',
        groupRegex: /[@-]\s?(DBTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'QHstudIo',
        groupRegex: /[@-]\s?(QHstudIo)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'HDo',
        groupRegex: /[@-]\s?(HDo)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "tjupt.org",
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(TJUPT)/i,
    groups: [
      { 
        groupName: 'TJUPT',
        groupRegex : /[@-]\s?(TJUPT)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "totheglory.im",
    seedList: "#ka2 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka2 > table > tbody > tr > td:nth-child(4)",
    seedingSummary:
      "#main_table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td:nth-child(2)",
    siteRegex: /[@-]\s?(TTG|Wiki|NGB|DoA|ARiN|ExREN)/i,
    groups: [
      { 
        groupName: 'TTG',
        groupRegex : /[@-]\s?(TTG)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'Wiki',
        groupRegex: /[@-]\s?(Wiki)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'NGB',
        groupRegex: /[@-]\s?(NGB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'DoA',
        groupRegex: /[@-]\s?(DoA)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ARiN',
        groupRegex: /[@-]\s?(ARiN)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ExREN',
        groupRegex: /[@-]\s?(ExREN)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "frds",
    seedList: "",
    seedListSize: "",
    seedingSummary: "",
    siteRegex: /[@-]\s?(FRDS)/i,
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "beitai",
    seedList: "",
    seedListSize: "",
    seedingSummary: "",
    siteRegex: /[@-]\s?(BeiTai)/i,
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "Others",
    seedList: "",
    seedListSize: "",
    seedingSummary:"",
    siteRegex: /[@-]\s?(Others)/i,
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
];


function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function sizeStrToBytes(sizeStr) {
  var regex = /[+-]?\d+(\.\d+)?/g;
  var num = sizeStr.match(regex).map(function (v) {
    return parseFloat(v);
  });
  var size = 0;
  if (sizeStr.match(/(KB|KiB)/i)) {
    size = num * 1024;
  } else if (sizeStr.match(/(MB|MiB)/i)) {
    size = num * 1024 * 1024;
  } else if (sizeStr.match(/(GB|GiB)/i)) {
    size = num * 1024 * 1024 * 1024;
  } else if (sizeStr.match(/(TB|TiB)/i)) {
    size = num * 1024 * 1024 * 1024 * 1024;
  } else {
    size = num;
  }

  return size;
}


function getSeedList(seedHtml, theConfig) {
  var seedList = seedHtml.querySelectorAll(
    theConfig.seedList
  );
  var seedListSize = seedHtml.querySelectorAll(
    theConfig.seedListSize
  );
  var totalTorCount = 0;
  var totalTorSize = 0;

  for (var i = 0; i < seedList.length; i++) {
    var torName;
    var torSize;
    var foundGroup;
    if (theConfig.useTitle) torName = seedList[i].title;
    else torName = seedList[i].innerText;
    torSize = sizeStrToBytes(seedListSize[i + 1].innerText);
    totalTorCount ++;
    totalTorSize += torSize;

    var foundConfig = config.find(cc => torName.match(cc.siteRegex))
    if (foundConfig){
      foundConfig.torCount ++;
      if (foundConfig == theConfig) {
        seedList[i].parentNode.style = "background-color: lightgreen;";
        foundGroup = theConfig.groups.find(gg => torName.match(gg.groupRegex));
        if (foundGroup){
          foundGroup.groupCount++;
          foundGroup.groupSize += torSize;
        }
      }
      foundConfig.torSize += torSize;
    } else {
      config[OTHERS_INDEX].torCount ++;
      config[OTHERS_INDEX].torSize += torSize;
    }
  }

  GM_addStyle("#ot_block {font-weight: bold;font-family: Arial, Helvetica, sans-serif;border-collapse: collapse; width: 100%;}");
  GM_addStyle("#ot_block td, #ot_summary th{vertical-align: top;border: none;padding: 18px;}");

  GM_addStyle("#ot_summary {font-weight: normal;font-family: Arial, Helvetica, sans-serif;border-collapse: collapse; width: 100%;}");
  GM_addStyle("#ot_summary tr:nth-child(even){background-color: #f2f2f2;}");
  GM_addStyle("#ot_summary tr:hover {background-color: #ddd;}");
  GM_addStyle("#ot_summary td, #ot_summary th{border: 1px solid #ddd;padding: 4px;}");
  GM_addStyle("#ot_summary th{padding-top: 6px;padding-bottom: 6px;text-align: left;color: white;background-color: #2f4879;}");

  var groupSumary = '<table id="ot_summary"><tr><th>官组</th><th>数量</th><th>大小</th><tbody>';
  for (i=0; i<theConfig.groups.length; i++){
    if (theConfig.groups[i].groupCount >0){
      groupSumary += '<tr><td>'+theConfig.groups[i].groupName+'</td><td>'+theConfig.groups[i].groupCount+'</td><td>' +formatBytes(theConfig.groups[i].groupSize)+'</td></tr>';
    }
  }
  groupSumary += '</tbody></table>';
  var sitesSumary = '<table id="ot_summary"><tr><th>各站官种</th><th>数量</th><th>大小</th>';
  for (i=0; i<config.length; i++ )
  {
    if (config[i].torCount > 0) {
      sitesSumary += '<tr><td>'+config[i].host + '</td><td>'+ config[i].torCount + '</td><td>' + formatBytes(config[i].torSize) + '</td></tr>';
    }
  }
  sitesSumary += '</tbody></table>';

  var summary = document.querySelector(theConfig.seedingSummary);
  summary.innerHTML = '<table id="ot_block"><tbody><tr><td>'+
    '作种总数：' + totalTorCount + ' 总大小： '+ formatBytes(totalTorSize) + '<p>' + sitesSumary + 
    '</td><td>'+
    '本站官种数量：' + theConfig.torCount + ' 官种大小： '+ formatBytes(theConfig.torSize) + '<p>' + groupSumary +
    '</td></tr></tbody></table>'+summary.innerHTML ;

}


(function () {
  "use strict";

  if (window.location.host == "totheglory.im") {
    getSeedList(document, config[TTG_INDEX]);  // REMEMBER THIS
  } else {
    var intv = setInterval(function() {
      var elems = document.querySelectorAll('#ka1 > table > tbody > tr');
      if (elems && elems.length <  1){
            return false;
      }
      //when element is found, clear the interval.
      clearInterval(intv);

      var thisConfig = config.find(cc => window.location.host.includes(cc.host));
      if (thisConfig) getSeedList(document, thisConfig);
    }, 1000);
  }
  
})();
