/**
 * 百度api经纬度信息转换
 */

// 引入所需库
const axios = require('axios');

// 引入其他方法
const config = require('./../../common/config');

/**
 * 使用百度api转换 经纬度位置信息为地址
 */

// 根据经纬度获取位置信息, 一次获取一条
const handlePosition = async (lat, lng) => {
  try {
    let position;
    let url = `http://api.map.baidu.com/geocoder/v2/?location=${lat},${lng}&output=json&pois=1&ak=${config.parsed.BAIDU_AK}&ret_coordtype=WGS84`;
    await axios.get(url).then((res) => {
      position = res.data;
    }).catch((err) => {
      console.log(err);
    });
    return position;
  } catch (err) {
    console.log(err);
  }
};

/**
 * 使用百度api转换 地址转经纬度信息
 */
// 根据地址得到经纬度信息
const handleAddress = async (address) => {
  // let url = `http://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${config.parsed.BAIDU_AK}`;
  try {
    let position;
    let url = `http://api.map.baidu.com/geocoder/v2/?address=${encodeURIComponent(address)}&output=json&ak=${config.parsed.BAIDU_AK}&ret_coordtype=WGS84`;
    await axios.get(url)
    .then((res) => {
      position = res.data;
    }).catch((err) => {
      console.log(err);
    });
    return position;
  } catch (err) {
    console.log(err);
  }
};

/**
 * 将其他第三方坐标转换为百度经纬度坐标坐标
 */
const handleCoordinate = async (position, from) => {
  // let url = `http://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${config.parsed.BAIDU_AK}`;
  // 1：GPS设备获取的角度坐标，wgs84坐标;
  // 2：GPS获取的米制坐标、sogou地图所用坐标;
  // 3：google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标，国测局（gcj02）坐标;
  // 4：3中列表地图坐标对应的米制坐标;
  // 5：百度地图采用的经纬度坐标;
  // 6：百度地图采用的米制坐标;
  // 7：mapbar地图坐标;
  // 8：51地图坐标
  try {
    let position;
    let url = `http://api.map.baidu.com/geoconv/v1/?coords=${position.lng},${position.lat}&from=${from}&to=5&ak=${config.parsed.BAIDU_AK}&output=json`;
    await axios.get(url)
    .then((res) => {
      position = res.data;
    }).catch((err) => {
      console.log(err);
    });
    return position;
  } catch (err) {
    console.log(err);
  }
};

module.exports.handlePosition = handlePosition;
module.exports.handleAddress = handleAddress;
module.exports.handleCoordinate = handleCoordinate;

module.exports.register = ({ router }) => {
};
