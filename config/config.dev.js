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
      hostname: '', // 连接地址
      port: '',
      username: '',
      password: '',
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
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
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
