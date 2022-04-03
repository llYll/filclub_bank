'use strict';

module.exports = app => {
  const { STRING, INTEGER, DECIMAL, Op } = app.Sequelize;

  const User = app.model.define(
    'user',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '主键',
      },
      tel: {
        type: STRING(255),
        allowNull: false,
        comment: '手机号',
      },
      nickname: {
        type: STRING(255),
        allowNull: false,
        comment: '昵称',
      },
    },
    {
      tableName: 'user',
    }
  );

  /**
   * 分配钱包
   * @param appId
   * @param wallets
   * @returns {Promise<*>}
   */
  User.findByTel = async function (tel) {
    return await this.findOne({
      where: {
        tel,
      },
    });
  };
  return User;
};
