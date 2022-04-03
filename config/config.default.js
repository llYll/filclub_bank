/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1604282424081_7651';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  config.logger = {
    dir: './logs/', // 打印目录重定向
    outputJSON: true, // json格式输出
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.constant = require('../app/common/constant');

  // config.lotus = {
  //   url: 'http://api.lotus.diancun.net/rpc/v0',
  //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXSwiTm9kZSI6ImJsYWNrIn0.7meLuhoxzCQasr6W4oQuebuX-WpwEHMs19kh45eirMc'
  // };
  config.lotus = {
    // url: 'http://115.236.22.225:11234/rpc/v0',
    // token:
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.8tbQ_oFneIcVAnDCFtNcp3YKclQQLIWMUhoEH5Kn9Nw',
    url: 'http://115.236.46.99:1234/rpc/v0',
    token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.wII5xkO3e1y4oFQ6vUsouBAhDbdRo8biIDZ8VK5sECI',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {};

  return {
    ...config,
    ...userConfig,
  };
};
