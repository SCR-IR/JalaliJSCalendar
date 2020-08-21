/*
 * JalaliJSCalendar - Jalali Extension for Date Object 
 * Copyright (c) 2008 Ali Farhadi (http://farhadi.ir/)
 * Released under the terms of the GNU General Public License.
 * See the GPL for details (http://www.gnu.org/licenses/gpl.html).
 * 
 * Based on code from http://farsiweb.info
 * Edit: 2020=۱۳۹۹ (https://jdf.scr.ir/jdf/)
 */

const JalaliDate = class {

  static jalaliToGregorian = (jy, jm, jd) => {
    [jy, jm, jd] = [parseInt(jy), parseInt(jm), parseInt(jd)];
    let sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * parseInt(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * parseInt(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy += parseInt((days - 1) / 365);
      days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy, gm, gd];
  };

  static gregorianToJalali = (gy, gm, gd) => {
    [gy, gm, gd] = [parseInt(gy), parseInt(gm), parseInt(gd)];
    let g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = 355666 + (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    jy = -1595 + (33 * parseInt(days / 12053));
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += parseInt((days - 1) / 365);
      days = (days - 1) % 365;
    }
    if (days < 186) {
      jm = 1 + parseInt(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + parseInt((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    return [jy, jm, jd];
  };

  static checkDate = (py, pm, pd) => {
    return !(py < 0 || py > 32767 || pm < 1 || pm > 12 || pd < 1 || pd > this.pDaysInMonth(py, pm));
  };

  static isKabiseh = (py, outType = 'bool') => {
    types = {
      'int': [0, 1],
      'bool': [false, true],
      'yearDays': [365, 366],
      'esfandDays': [29, 30],
      'farsi': ["کبیسه نیست", "کبیسه است"]
    }
    return ((((py % 33) % 4) - 1) === parseInt((py % 33) * 0.05)) ? types[outType][1] : types[outType][0];
  };

  static pDaysInMonth = (py, pm) => {
    return ((pm < 7) ? 31 : ((pm < 12) ? 30 : this.isKabiseh(py, 'esfandDays')));
  };

};


Date.prototype.setJalaliFullYear = function (y, m, d) {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  if (y < 100) y += 1300;
  j[0] = y;
  if (m != undefined) {
    if (m > 11) {
      j[0] += Math.floor(m / 12);
      m = m % 12;
    }
    j[1] = m + 1;
  }
  if (d != undefined) j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliMonth = function (m, d) {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  if (m > 11) {
    j[0] += Math.floor(m / 12);
    m = m % 12;
  }
  j[1] = m + 1;
  if (d != undefined) j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliDate = function (d) {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.getJalaliFullYear = function () {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[0];
}

Date.prototype.getJalaliMonth = function () {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[1] - 1;
}

Date.prototype.getJalaliDate = function () {
  let gd = this.getDate();
  let gm = this.getMonth();
  let gy = this.getFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[2];
}

Date.prototype.getJalaliDay = function () {
  let day = this.getDay();
  day = (day + 1) % 7;
  return day;
}


/**
 * Jalali UTC functions 
 */

Date.prototype.setJalaliUTCFullYear = function (y, m, d) {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  if (y < 100) y += 1300;
  j[0] = y;
  if (m != undefined) {
    if (m > 11) {
      j[0] += Math.floor(m / 12);
      m = m % 12;
    }
    j[1] = m + 1;
  }
  if (d != undefined) j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliUTCMonth = function (m, d) {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  if (m > 11) {
    j[0] += Math.floor(m / 12);
    m = m % 12;
  }
  j[1] = m + 1;
  if (d != undefined) j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.setJalaliUTCDate = function (d) {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  j[2] = d;
  let g = JalaliDate.jalaliToGregorian(j[0], j[1], j[2]);
  return this.setUTCFullYear(g[0], g[1] - 1, g[2]);
}

Date.prototype.getJalaliUTCFullYear = function () {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[0];
}

Date.prototype.getJalaliUTCMonth = function () {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[1] - 1;
}

Date.prototype.getJalaliUTCDate = function () {
  let gd = this.getUTCDate();
  let gm = this.getUTCMonth();
  let gy = this.getUTCFullYear();
  let j = JalaliDate.gregorianToJalali(gy, gm + 1, gd);
  return j[2];
}

Date.prototype.getJalaliUTCDay = function () {
  let day = this.getUTCDay();
  day = (day + 1) % 7;
  return day;
}
