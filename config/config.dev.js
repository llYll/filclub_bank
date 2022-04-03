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

  config.RABBITMQ_CONFIG = {
    OPTIONS: {
      protocol: 'amqp',
      hostname: '116.62.117.195', // 连接地址
      port: '5672',
      username: 'root',
      password: 'kdv8XbhTKMQH2Na0dv8XbhTKMQH2',
    },
    EXCHANGE_NAME: 'recharge',
    EXCHANGE_TYPE: {
      fanout: 'fanout',
      topic: 'topic',
      direct: 'direct',
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '116.62.117.195',
    port: '20005',
    database: 'filclub_bank_test',
    username: 'root',
    password: 'kdv8XbhTKUUUMQH2Na0',
    timezone: '+08:00', // 时区 - 北京时间
    logging: false, // 在终端显示数据库操作
    define: {
      timestamps: true, // 创建日期字段
      paranoid: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  };

  return {
    ...config,
    // ...userConfig,
  };
};
