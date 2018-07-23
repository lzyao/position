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
const handlePosition = async (latitude, longitude) => {
  try {
    let position;
    let url = `http://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&pois=1&ak=${config.parsed.BAIDU_AK}&ret_coordtype=WGS84`;
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

module.exports.handlePosition = handlePosition;
module.exports.handleAddress = handleAddress;

module.exports.register = ({ router }) => {
};
