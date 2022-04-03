/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
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
      hostname: '47.110.93.253', // 连接地址
      port: 5672,
      username: 'root',
      password: '123123',
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
    host: '127.0.0.1',
    port: 3306,
    database: 'bank',
    username: 'root',
    password: '123456',
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

  config.istring = {
    apiKey: '89561e53-daea-487a-abdf-c32c10298c12',
    platformPublicKey:
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiC2KuGa32HtXT5jTygqb/gyP+h2jN7XvbxoTt2IHZvNlv/Kycv2HFYnsgdLOu4tXjUcnFxqXEogMO6CLsWqlrIdRpaQYkr6mt1J8dcwK4sNX6WblFZGg+CDc+AOlkOccRZoCbJ+KzgNIMuDRiMFFqlG/bBolofHtjEwOSCZqjLOWKNK0Evd9QPFn2ub0ptUuZQyB/sNH4DGYgYdT/g2tbp5ZfPnFuD2BV2xJ7PathosJT2qQFbOkYbibnMaNoXYJvXjDPATsShOiG9uZtQa8UXDCtZM08+g4G1iJGTt4TzW7jv59a/kiCmogNKBZ/HzWfeWxJLlhry9FQi9EJZ+jZwIDAQAB\n-----END PUBLIC KEY-----\n',
    charEncode: 'utf8',
    privatePath: path.join(__dirname, '../pem/istring_private.pem'),
  };

  return {
    ...config,
    // ...userConfig,
  };
};
