// ==UserScript==
// @name         官种保种统计
// @namespace    https://greasyfork.org/zh-CN/scripts/432969
// @version      0.11
// @license      GPL-3.0 License
// @description  Count the seeding torrents, support ADE, PTer, SKY, OB, CHD, Hares, PTH, hddolby, tjupt, TTG, HDH, SSD, HDC, PtSbao
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
// @match        https://ptsbao.club/userdetails.php?id=*
// @match        https://audiences.me/userdetails.php?id=*
// @icon         https://ourbits.club//favicon.ico
// @grant        GM_addElement
// @grant        GM_addStyle
// ==/UserScript==

var config = [
  {
    host: "audiences.me",
    abbrev: "ADE", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Audies|ADE|ADWeb|ADAudio|ADeBook|ADMusic)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
    groups: [
      { 
        groupName: 'Audies',
        groupRegex : /[@-]\s?(Audies)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ADE',
        groupRegex: /[@-]\s?(ADE)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ADWeb',
        groupRegex: /[@-]\s?(ADWeb)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ADAudio',
        groupRegex: /[@-]\s?(ADAudio)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ADeBook',
        groupRegex: /[@-]\s?(ADeBook)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'ADMusic',
        groupRegex: /[@-]\s?(ADMusic)\b/i,
        groupCount: 0,
        groupSize: 0,
      }, 
    ],    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host : "hdsky.me",
    abbrev: "SKY", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(HDS)/i,
    seederLevels: [
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
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
    abbrev: "PTer", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a:nth-child(1)",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(5)",
    seedingSummary: "#ka1",
    siteRegex: /[@-]\s?(PTer)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
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
      },
      {
        groupName: '游戏',
        groupRegex: /game.php\b/i,
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
    abbrev: "OB", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Our|PbK|iLoveTV|FLTTH|Ao|MGs|HosT|iLoveHD)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "CHD", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(CHD|blucook|HQC|GBT|KAN|OneHD)/i,
    seederLevels: [
      {seederNum: 2, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 4, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
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
    abbrev: "Hares", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Hares)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "PTH", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(PTH)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "SSD", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(CMCT)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "HDH", 
    seedList: "#ka1 >  table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 >  table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(HDH)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "HDC", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > p",
    siteRegex: /[@-]\s?(HDC|k9611|tudou|iHD)/i,
    seederLevels: [
      {seederNum: 6, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 30, seederLevelCount: 0, seederLevelSize: 0}],
    groups: [
      { 
        groupName: 'HDChina',
        groupRegex : /[@-]\s?(HDChina)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      { 
        groupName: 'HDCTV',
        groupRegex : /[@-]\s?(HDCTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
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
    abbrev: "DB", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(Dream|DBTV|QHstudIo|HDo)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "TJU", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(TJUPT)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
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
    abbrev: "TTG", 
    seedList: "#ka2 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka2 > table > tbody > tr > td:nth-child(4)",
    seedListSeederCount: "#ka2 > table > tbody > tr > td:nth-child(5)",
    seedingSummary:
      "#main_table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr:nth-child(16) > td:nth-child(2)",
    siteRegex: /[@-]\s?(TTG|Wiki|NGB|DoA|ARiN|ExREN)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 20, seederLevelCount: 0, seederLevelSize: 0}],
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
    host: "ptsbao.club",
    abbrev: "PtSbao", 
    seedList: "#ka1 > table > tbody > tr > td:nth-child(2) > a",
    seedListSize: "#ka1 > table > tbody > tr > td:nth-child(3)",
    seedListSeederCount: "#ka1 > table > tbody > tr > td:nth-child(4)",
    seedingSummary: "#ka1 > b",
    siteRegex: /[@-]\s?(OPS|FFans|FHDMv)/i,
    seederLevels: [
      {seederNum: 3, seederLevelCount: 0, seederLevelSize: 0}, 
      {seederNum: 5, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 7, seederLevelCount: 0, seederLevelSize: 0},
      {seederNum: 11, seederLevelCount: 0, seederLevelSize: 0}
    ],
    groups: [
      { 
        groupName: 'OPS',
        groupRegex : /[@-]\s?(OPS)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FFansBD',
        groupRegex: /[@-]\s?(FFansBD)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FFansWEB',
        groupRegex: /[@-]\s?(FFansWEB)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FFansTV',
        groupRegex: /[@-]\s?(FFansTV)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FFansDVD',
        groupRegex: /[@-]\s?(FFansDVD)\b/i,
        groupCount: 0,
        groupSize: 0,
      },
      {
        groupName: 'FHDMv',
        groupRegex: /[@-]\s?(FHDMv)\b/i,
        groupCount: 0,
        groupSize: 0,
      }
    ],
    useTitle: true,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "pt.keepfrds.com",
    abbrev: "FRDS", 
    seedList: "",
    seedListSize: "",
    seedingSummary: "",
    siteRegex: /[@-]\s?(FRDS)/i,
    seederLevels: [],
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "beitai.pt",
    abbrev: "BeiTai", 
    seedList: "",
    seedListSize: "",
    seedingSummary: "",
    siteRegex: /[@-]\s?(BeiTai)/i,
    groups:[],
    seederLevels: [],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "google.com",
    abbrev: "beAst", 
    seedList: "",
    seedListSize: "",
    seedingSummary: "",
    siteRegex: /[@-]\s?(beAst)/i,
    seederLevels: [],
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
  {
    host: "google.com",
    abbrev: "Others", 
    seedList: "",
    seedListSize: "",
    seedingSummary:"",
    siteRegex: /[@-]\s?(Others)/i,
    seederLevels: [],
    groups:[],
    useTitle: false,
    torCount: 0,
    torSize: 0,
  },
];

const TTG_INDEX = 11;
var OTHERS_INDEX = config.length-1;

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
  var sizeStr2 = sizeStr.replace(/,/g, '');
  var num = sizeStr2.match(regex).map(function (v) {
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
  var seedListSeederNum = seedHtml.querySelectorAll(
    theConfig.seedListSeederCount
  );
  
  var totalTorCount = 0;
  var totalTorSize = 0;

  for (var i = 0; i < seedList.length; i++) {
    var torName;
    var torSize;
    var torSeederNum;
    var foundGroup;
    if (theConfig.useTitle) torName = seedList[i].title;
    else torName = seedList[i].innerText;

    torSize = sizeStrToBytes(seedListSize[i + 1].innerText);
    totalTorCount ++;
    totalTorSize += torSize;

    var foundConfig = config.find(cc => torName.match(cc.siteRegex))
    // for pterclub, all game is counted as ot
    var isPTerGameCat = false;
    if (theConfig.host == "pterclub.com") {
      isPTerGameCat = seedList[i].href.match(/game.php\b/i);
      if (isPTerGameCat) {
        foundConfig = theConfig;
      }
    }

    if (foundConfig){
      foundConfig.torCount ++;
      if (foundConfig == theConfig) {
        if (isPTerGameCat) {
          foundGroup = theConfig.groups.find(gg => (gg.groupName == '游戏'));
        } else {
          foundGroup = theConfig.groups.find(gg => torName.match(gg.groupRegex));
        }
        if (foundGroup){
          foundGroup.groupCount++;
          foundGroup.groupSize += torSize;
        }
        // cat the seeder level
        torSeederNum = parseFloat(seedListSeederNum[i+1].innerText);
        if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-2].seederNum) {
          seedList[i].parentNode.style = "background-color: #ef6216"; 
        }
        else if (torSeederNum < theConfig.seederLevels[theConfig.seederLevels.length-1].seederNum) {
          seedList[i].parentNode.style = "background-color: #f9f"; 
        }
        else {
          seedList[i].parentNode.style = "background-color: lightgreen;";
        }

        for (var sl=0; sl < theConfig.seederLevels.length; sl++) {
          if (torSeederNum < theConfig.seederLevels[sl].seederNum) {
            theConfig.seederLevels[sl].seederLevelCount++;
            theConfig.seederLevels[sl].seederLevelSize += torSize;
            break;
          }
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

  var groupSumary = '<table id="ot_summary"><tbody><th>官组</th><th>数量</th><th>大小</th>';
  for (i=0; i<theConfig.groups.length; i++){
    if (theConfig.groups[i].groupCount >0){
      groupSumary += '<tr><td>'+theConfig.groups[i].groupName+'</td><td>'+theConfig.groups[i].groupCount+'</td><td>' +formatBytes(theConfig.groups[i].groupSize)+'</td></tr>';
    }
  }
  groupSumary += '</tbody></table>';

  var seederLevelSumary = '';
  if (theConfig.seederLevels.length > 0) {
    seederLevelSumary = '<table id="ot_summary"><tbody><th>作种人数</th><th>数量</th><th>大小</th>';
    for (i=0; i<theConfig.seederLevels.length; i++){
      seederLevelSumary += '<tr><td> 小于 '+theConfig.seederLevels[i].seederNum+'</td><td>'
        + theConfig.seederLevels[i].seederLevelCount+'</td><td>'
        + formatBytes(theConfig.seederLevels[i].seederLevelSize)+'</td></tr>';
    }
    seederLevelSumary += '</tbody></table>';      
  }

  var sitesSumary = '<table id="ot_summary"><tbody><th>各站官种</th><th>数量</th><th>大小</th>';
  for (i=0; i<config.length; i++ )
  {
    if (config[i].torCount > 0) {
      sitesSumary += '<tr><td><a href="https://'+config[i].host+'" target="_blank">'+config[i].abbrev + '</a></td><td>'
        + config[i].torCount + '</td><td>' 
        + formatBytes(config[i].torSize) + '</td></tr>';
    }
  }
  sitesSumary += '</tbody></table>';


  var summary = document.querySelector(theConfig.seedingSummary);
  summary.innerHTML = '<table id="ot_block"><tbody><tr><td>'
    + '作种总数：' + totalTorCount + ' 总大小： '+ formatBytes(totalTorSize) + '<br>' 
    + sitesSumary + '</td><td>'
    + '<div>本站官种数量：' + theConfig.torCount + ' 官种大小： '+ formatBytes(theConfig.torSize) + '<br>' 
    + groupSumary 
    + '</div><div><p>' + seederLevelSumary +'</div>'
    + '</td></tr></tbody></table>'+summary.innerHTML ;

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
