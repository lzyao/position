/**
 * 测试controller
 */
const baidu = require('./../baidu/controller');
const moment = require('moment');
const axios = require('axios');
const util = require('./../util/service');

const testBaiduPosition = async (ctx) => {
  const position = await baidu.handlePosition(39.97711, 116.321481);
  console.log(position);
};
const testBaiduAddress = async (ctx) => {
  const position = await baidu.handleAddress('北京市海淀区上地十街10号');
  console.log(position);
};
const testCountPosition = async (ctx) => {
  // 116.321481,39.97711
  // 116.401394,39.919583
  // 116.236393,39.965166
  const distance = util.getFlatternDistance({lat: 39.97711, lng: 116.321481}, {lat: 39.965166, lng: 116.236393});
  console.log(distance);
};
const testMoment = async (ctx) => {
  // 计算两个时间差，单位
  var a = moment('2018-07-06 00:00:00');
  var b = moment(new Date());
  console.log(b.diff(a, 'days'));
};

// 测试接收定位日志接口
const testToolBoxLog = async () => {
  // 121.322959,31.298899
  // 121.39511,31.252727
  // 121.451596,31.261926
  // 121.486953,31.24291
  // 121.486953,31.24291
  // 测试位置信息
  let positions = [
    {device: 'A0001', RFID: 'B0001', lat: 31.298899, lng: 121.322959},
    {device: 'A0001', RFID: 'B0001', lat: 31.252727, lng: 121.39511},
    {device: 'A0001', RFID: 'B0001', lat: 31.261926, lng: 121.451596},
    {device: 'A0001', RFID: 'B0001', lat: 31.24291, lng: 121.486953},
    {device: 'A0001', RFID: 'B0001', lat: 31.24291, lng: 121.486953}
  ];
  for (let position in positions) {
    await axios.get('192.168.1.207:8080/api/record/toolbox', {
      params: {
        device: position.device,
        RFID: position.RFID,
        lat: position.lat,
        lng: position.lng
      }
    }).then((res) => {
      console.log(res.data);
    });
  }
};

const run = async () => {
  const test = await baidu.handlePosition(23.12849235534668, 113.31507110595703);
  console.log(test.result.formatted_address);
  const result = await baidu.handleAddress(test.result.formatted_address);
  console.log(result);
  const test2 = await baidu.handlePosition(result.result.location.lat, result.result.location.lng);
  console.log(test2.result.formatted_address);
};
run();