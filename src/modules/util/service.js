
var EARTH_RADIUS = 6378137.0; // 单位M
var PI = Math.PI;
const getRad = (d) => {
  return d * PI / 180.0;
};
const util = {
  /**
   * 接口返回数据格式
   */
  returnBody: (status, msg, data) => {
    return {
      status: status, // 状态码 1/0 成功或失败
      msg: msg, // 返回结果，data，或这
      data: data
    };
  },
  /**
   * 得到两个经纬度之前的距离
   */
  getFlatternDistance: (startPosition, endPosition) => {
    var f = getRad((startPosition.lat + endPosition.lat) / 2);
    var g = getRad((startPosition.lat - endPosition.lat) / 2);
    var l = getRad((startPosition.lng - endPosition.lng) / 2);
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;
    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    const test = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    return test;
  }
};
module.exports = util;