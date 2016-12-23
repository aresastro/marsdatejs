/*
 * MarsDate.js 0.0.4
 * (c) 2016 Dean Little <aresastro.com>
 * MIT license
 *
 * Based upon the Darian Calendar by Dr. Thomas Gangale,
 * Mars24 equations from NASA, and the Ares Timezone
 * System by Ares Astronautics.
 *
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 */

'use strict';

class MarsDate {
  constructor() {
    var tzRegex = /[^-+\dA-Z]/g;
    var dateRegex = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
    var m = this.solveDate(inputType(arguments[0]), arguments);
    this.millis = m.millis;
    this.json = m.dateObject;
    this.string = this.formatDate(MarsDate.i18n.toString);
    this.earthDate = m.earthDate;
    function inputType(i) {
      var t = {}.toString.call(i).split(' ')[1].slice(0, -1).toLowerCase();
      if(t=='number'){
        if(this.arguments.length>=3) {
          t='marsdate';
        } else if (this.arguments[0]%1!=0){
          t='msd'
        }
      }
      return t;
    }
  }
  [Symbol.toPrimitive](hint) {
    return hint === "number" ? this.millis : this.string;
  }
  toString(){
    return this.formatDate(MarsDate.i18n.toString);
  }
  toDateString(){
    return this.formatDate(MarsDate.i18n.toDateString);  
  }
  toJSON(){
    return this.formatDate(MarsDate.i18n.toJSON);
  }
  toISOString(){
    return this.formatDate(MarsDate.i18n.toISOString);
  }
  toMTCString(){
    var m = this.solveFromMSD(this.millis/86400000);
    return this.formatDate(MarsDate.i18n.toMTCString);
  }
  setTimezone(a){
    this.json.Z = MarsDate.i18n.timezones[a];
    var p = (a[0]==="+") ? 1 : -1;
    var i = (a[1]*10 + 1*a[2])*3600000*p;
    var mi = (i+(1*this.millis))/86400000;
    var m = this.getDateFromMSD(mi);
    this.json = m;
    this.json.Z = MarsDate.i18n.timezones[a];
    this.string = this.formatDate(MarsDate.i18n.toString);
  }

  solveDate(t, a){
    var m = {};
    switch(t) {
      case 'undefined':
        m = this.solveFromEarthDate();
        break;
      case 'date':
        m = this.solveFromEarthDate(a[0]);
        break;
      case 'msd':
        m = this.solveFromMSD(a[0]);
        break;
      case 'number':
        m = this.solveFromMSD(a[0]/86400000);
        break;
      case 'string':
        m = this.solveFromDateString(a[0]);
        break;
      case 'marsdate':
        m = this.solveFromDate(m, a);
        break;
    }
    return m;
  }

  solveFromEarthDate(d){
    var m = {};
    m.earthDate = d || new Date();
    m.j2000 = this.getj2000FromEarthDate(m.earthDate);
    m.MSD = this.getMSDFromj2000(m.j2000);
    m.dateObject = this.getDateFromMSD(m.MSD);
    m.millis = Math.floor(m.MSD*86400000);
    return m
  }

  solveFromMSD(msd){
    var m = {}
    m.MSD = msd;
    m.j2000 = this.getj2000FromMSD(m.MSD);
    m.earthDate = this.getEarthDateFromj2000(m.j2000);
    m.dateObject = this.getDateFromMSD(m.MSD);
    m.millis = Math.floor(m.MSD*86400000);
    return m;
  }

  solveFromDateString(a){
    var a = this.getArgumentsFromDateString(a);
    var m = this.solveFromDate(a);
  }

  solveFromDate(a){
    var d = {
      y: a[0],
      m: a[1],
      d: a[2],
      H: a[3] || 0,
      M: a[4] || 0,
      s: a[5] || 0,
      l: a[6] || 0
    };
    var m = {};
    m.MSD = this.getMSDFromDate(d);
    m.j2000 = this.getj2000FromMSD(m.MSD);
    m.earthDate = this.getEarthDateFromj2000(m.j2000);
    m.dateObject = this.getDateFromMSD(m.MSD);
    m.millis = Math.floor(m.MSD*86400000);
    return m;
  }

  formatDate(s){
    var a = this.json;
    if(s.match("|")){
      s = s.split("|");
      var matches = s;
      s = s.shift();
    }
    if(!a.Z){
      a.Z = MarsDate.i18n.timezones["+0000"];
    }
    var tzRegex = /[^-+\dA-Z]/g;
    //Replace AMPM
    s = s.replace("TT", a.TT);
    s = s.replace("T", a.T);
    s = s.replace("tt", a.tt);
    s = s.replace("t", a.t);

    //Replace years
    s = s.replace("yyyy", this.pad(a.y, 4));
    s = s.replace("yyy", a.yyy);
    s = s.replace("yy", a.yy);
    
    //Replace Seconds
    s = s.replace("ss", a.ss);
    s = s.replace("l", a.l);
    s = s.replace("L", a.L);

    //Replace months
    s = s.replace("mmmm", a.mmmm);
    s = s.replace("mmm", a.mmm);
    s = s.replace("mm", a.mm);
    //Replace Sols
    s = s.replace("dddd", a.dddd);
    s = s.replace("ddd", a.ddd);
    s = s.replace("dd", a.dd);
    s = s.replace("d", a.d);
    s = s.replace("N", a.N);
    
    //Replace Hours
    s = s.replace("HH", a.HH);
    s = s.replace("H", a.H);
    s = s.replace("hh", a.hh);
    s = s.replace("h", a.h);

    //Replace Minutes
    s = s.replace("MM", a.MM);

    //Replace Week
    s = s.replace("W", a.W);

    s = s.replace("Z", MarsDate.i18n.timezones["+0000"].tz + a.Z.offset + " (" + a.Z.tz + ")");

    if(matches){
      for(var i=0; i<matches.length; i++){
        s = s.replace("X", matches[i]);
      }
    }
    return s;
  }

  /*

  Earth Date to Date Conversion Functions
  Earth Date -> j2000 -> MSD -> Date/MTC

  */

  getj2000FromEarthDate(d){
    return 2440587.5 + d.getTime()/86400000 + 67.184/86400 - 2451545;
  }

  getMSDFromj2000(d){
    return (d-4.5)/(88775244.147/86400000) + 44796.0 - 0.0009626 + 94129;
  }

  getDateFromMSD(d){
    var m = {};
    m.H = Math.floor((24*d) % 24);
    m.M = Math.floor((1440*d) % 60);
    m.M = Math.floor((1440*d) % 60);
    m.s = Math.floor((86400*d) % 60);
    m.l = Math.floor((86400000*d) % 1000);
    m.n = Math.floor(d) + 1;
    for(m.y = 0; m.n>669; m.y++){
      if(this.isLeapYear(m.y)){
        m.n-=669;
      } else {
        m.n-=668;
      }
    }
    m.ly = this.isLeapYear(m.y);
    if(!m.ly && m.n>668){
      m.y++;
      m.n=1;
    }
    m.n = Math.floor(m.n);
    m.q = Math.floor(m.n/167);
    m.q = (m.q>3) ? 3 : m.q;
    m.m =  Math.floor(m.q*6 + (m.n-m.q*167)/28);
    m.m = (m.m>23) ? 23 : m.m;
    m.d = m.n - m.q*167 - ((m.m%6)*28);
    return this.createDateObjects(m);
  }

  /*

  Date to Earth Date Reversal Functions

  Date/MTC -> MSD -> j2000 -> Earth Date

  */

  getEarthDateFromj2000(d){
    return new Date((d - 67.184/86400 + 2451545) * 86400000 - 2440587.5);
  }

  getj2000FromMSD(d){
    return (d - 94129 + 0.0009626 - 44796.0) * (88775244.147/86400000) + 4.5;
  }

  getMSDFromDate(x){
    var m = x.d + (x.m*28) - Math.floor(x.m/6) - 94129 + ((x.l + 1000*(x.s + (60*x.M + (60* x.H))))/86400000);
    for(var i = 0; i<x.y; i++){
      if(isLeapYear(x.year)){
        m+=669;
      } else {
        m+=668;
      }
    }
    return m;
  }

  /*
    Date processing functions
  */

  getArgumentsFromDateString(s){
    var d = s.split(" ");
    var t = d[4].split(":");
    var a = [d[3],d[1],d[2],t[0],t[1],t[2],0];
    for(var i=0; i<MarsDate.i18n.mon.length; i++){
      if(a[1]===MarsDate.i18n.mon[i]){
        a[1] = i;
        break;
      }
    }
    return a;
  }

  pad(n, l) {
    var s = n.toString();
    l = l || 2;
    while (s.length < l) {
      s = '0' + s;
    }
    return s;
  }

  createDateObjects(m){
    if(!m.q){
      m.q = Math.ceil((m.m+1)/6) - 1;
    }
    if(!m.n){
      m.n = m.d + (m.m*28) - Math.floor(m.m/6);
    }
    if(!m.l){
      m.l = "000";
    }
    m.HH = this.pad(m.H, 2);
    m.h = m.H%12;
    m.h = (m.h===0) ? 12 : 0;
    m.hh = this.pad(m.h, 2);
    m.MM = this.pad(m.M, 2);
    m.TT = (m.H>11) ? 'PM':'AM';
    m.T = m.TT[0];
    m.tt = m.TT.toLowerCase();
    m.t = m.tt[0];
    m.ss = this.pad(m.s, 2);
    m.L = Math.floor(m.l/10);
    m.dd = this.pad(m.d, 2);
    m.N = (m.d-1)%7;
    m.dddd = MarsDate.i18n.sols[m.N];
    m.ddd = m.dddd.slice(4,7);
    m.yy = this.pad((m.y%100),2);
    m.yyy = m.y;
    // m.yyyy = pad(m.y, 4);
    m.W = m.m*4 + Math.ceil(m.d/7);
    m.mm = this.pad(m.m,2);
    m.mmmm = MarsDate.i18n.months[m.m]
    m.mmm = MarsDate.i18n.mon[m.m]
    m.l = this.pad(m.l, 3);
    return m;
  }

  isLeapYear(i){
      return (i%500==0 || i%10==0 && i%100!=0 || i%2!=0);
  }
}
MarsDate.i18n = {
    months: ['Sagittarius','Dhanus','Capricornus','Makara','Aquarius','Kumbha','Pisces','Mina','Aries','Mesha','Taurus','Rishabha','Gemini','Mithuna','Cancer','Karka','Leo','Simha','Virgo','Kanya','Libra','Tula','Scorpius','Vrishika'],
    mon: ['Sag','Dha','Cap','Mak','Aqu','Kum','Pis','Min','Ari','Mes','Tau','Ris','Gem','Mit','Can','Kar','Leo','Sim','Vir','Kan','Lib','Tul','Sco','Vri'],
    sols: ['Sol Solis','Sol Lunae','Sol Martis','Sol Mercurii','Sol Jovis','Sol Veneris','Sol Saturni'],
    sol: ['Sol','Lun','Mar','Mer','Jov','Ven','Sat'],
    timezones: {
      "-1100": {
        label: "Western Amazonian Time",
        tz: "WAT",
        longitude: {
          min: -172.5,
          max: -157.5
        },
        offset: "-1100"
      },
      "-1000": {
        label: "Central Amazonian Time",
        tz: "CAT",
        longitude: {
          min: -157.5,
          max: -142.5
        },
        offset: "-1000"
      },
      "-0900": {
        label: "Eastern Amazonian Time",
        tz: "EAT",
        longitude: {
          min: -142.5,
          max: -127.5
        },
        offset: "-0900"
      },
      "-0800": {
        label: "Western Tharsic Time",
        tz: "WTT",
        longitude: {
          min: -127.5,
          max: -112.5
        },
        offset: "-0800"
      },
      "-0700": {
        label: "Central Tharsic Time",
        tz: "CTT",
        longitude: {
          min: -112.5,
          max: -97.5
        },
        offset: "-0700"
      },
      "-0600": {
        label: "Eastern Tharsic Time",
        tz: "ETT",
        longitude: {
          min: -97.5,
          max: -82.5
        },
        offset: "-0600"
      },
      "-0500": {
        label: "Western Lunar Time",
        tz: "WLT",
        longitude: {
          min: -82.5,
          max: -67.5
        },
        offset: "-0500"
      },
      "-0400": {
        label: "Central Lunar Time",
        tz: "CLT",
        longitude: {
          min: -67.5,
          max: -52.5
        },
        offset: "-0400"
      },
      "-0300": {
        label: "Eastern Lunar Time",
        tz: "ELT",
        longitude: {
          min: -52.5,
          max: -37.5
        },
        offset: "-0300"
      },
      "-0200": {
        label: "Western Oxian Time",
        tz: "WOT",
        longitude: {
          min: -37.5,
          max: -22.5
        },
        offset: "-0200"
      },
      "-0100": {
        label: "Central Oxian Time",
        tz: "COT",
        longitude: {
          min: -22.5,
          max: -7.5
        },
        offset: "-0100"
      },
      "+0000": {
        label: "Airy Mean Time",
        tz: "AMT",
        longitude: {
          min: -7.5,
          max: 7.5
        },
        offset: "+0000"
      },
      "+0100": {
        label: "Western Arabian Time",
        tz: "WRT",
        longitude: {
          min: 7.5,
          max: 22.5
        },
        offset: "+0100"
      },
      "+0200": {
        label: "Central Arabian Time",
        tz: "CRT",
        longitude: {
          min: 22.5,
          max: 37.5
        },
        offset: "+0200"
      },
      "+0300": {
        label: "Eastern Arabian Time",
        tz: "ERT",
        longitude: {
          min: 37.5,
          max: 52.5
        },
        offset: "+0300"
      },
      "+0400": {
        label: "Western Syrtic Time",
        tz: "WST",
        longitude: {
          min: 52.5,
          max: 67.5
        },
        offset: "+0400"
      },
      "+0500": {
        label: "Central Syrtic Time",
        tz: "CST",
        longitude: {
          min: 67.5,
          max: 82.5
        },
        offset: "+0500"
      },
      "+0600": {
        label: "Eastern Syrtic Time",
        tz: "EST",
        longitude: {
          min: 82.5,
          max: 97.5
        },
        offset: "+0600"
      },
      "+0700": {
        label: "Western Amenthean Time",
        tz: "WMT",
        longitude: {
          min: 97.5,
          max: 112.5
        },
        offset: "+0700"
      },
      "+0800": {
        label: "Central Amenthean Time",
        tz: "CMT",
        longitude: {
          min: 112.5,
          max: 127.5
        },
        offset: "+0800"
      },
      "+0900": {
        label: "Eastern Amenthean Time",
        tz: "EMT",
        longitude: {
          min: 127.5,
          max: 142.5
        },
        offset: "+0900"
      },
      "+1000": {
        label: "Western Elysian Time",
        tz: "WET",
        longitude: {
          min: 142.5,
          max: 157.5
        },
        offset: "+1000"
      },
      "+1100": {
        label: "Central Elysian Time",
        tz: "CET",
        longitude: {
          min: 157.5,
          max: 172.5
        },
        offset: "+1100"
      },
      "+1200": {
        label: "Eastern Elysian Time",
        tz: "EET",
        longitude: {
          min: 172.5,
          max: -172.5
        },
        offset: "+1200"
      },
      "-021301": {
        label: "Pathfinder",
        tz: "PAT",
        longitude: 0,
        offset:"-021301"
      },
      "+110004": {
        label: "Spirit",
        tz: "SPI",
        longitude: 0,
        offset: "+110004",
      },
      "-010106": {
        label: "Opportunity",
        tz: "OPP",
        longitude: 0,
        offset: "-010106"
      },
      "+090946": {
        label: "Curiosity",
        tz: "CUR",
        longitude: 0,
        offset: "+090946"
      }
    },
    toString: 'ddd mmm d yyy HH:MM:ss Z',
    toDateString: 'ddd mmm d yyy',
    toJSON: 'yyy-mm-ddXHH:MM:ss.lA|T',
    toISOString: 'yyy-mm-ddXHH:MM:ss.lA|T',
    toMTCString: 'ddd, dd mmm yyy HH:MM:ss X|AMT'
  };
