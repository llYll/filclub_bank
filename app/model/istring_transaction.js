'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const IstingTransaction = app.model.define(
    'transaction',
    {
      id: {
        type: INTEGER(10).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: '主键',
      },
      type: {
        type: INTEGER(1).UNSIGNED,
        allowNull: false,
        comment: '交易类型1.转账 2 收款',
        set(value) {
          this.setDataValue('type', Number.parseInt(value));
        },
      },
      businessType: {
        type: INTEGER(1).UNSIGNED,
        allowNull: false,
        comment: '1: On Chain 2：Off Chain',
        set(value) {
          this.setDataValue('businessType', Number.parseInt(value));
        },
      },
      to: {
        type: STRING(255),
        allowNull: false,
        comment: '接收地址',
      },
      from: {
        type: STRING(255),
        allowNull: false,
        comment: '发送地址',
      },
      coinName: {
        type: STRING(50),
        allowNull: false,
        comment: '交易币种',
      },
      tradeNo: {
        type: STRING(255),
        allowNull: false,
        comment: '弦冰清算唯一标识',
      },
      uniqTradeNo: {
        type: STRING(255),
        allowNull: false,
        comment: 'transfer api调用时传入的业务唯一标识',
      },
      tradeAmount: {
        type: STRING(255),
        allowNull: false,
        comment: '交易数量',
      },
      tradeFee: {
        type: STRING(255),
        allowNull: false,
        comment: '手续费',
      },
      txStatus: {
        type: INTEGER(1).UNSIGNED,
        allowNull: false,
        comment:
          '0 等待处理 1： 等待打包 2：打包中 3： 交易成功 4：交易失败 On Chain类型才有 5：取消 6：审核拒绝',
        set(value) {
          this.setDataValue('txStatus', Number.parseInt(value));
        },
      },
      blockHeight: {
        type: INTEGER(11).UNSIGNED,
        allowNull: false,
        comment: '块高度，On Chain类型才有',
        set(value) {
          this.setDataValue('blockHeight', Number.parseInt(value));
        },
      },
      txHash: {
        type: STRING(255),
        allowNull: false,
        comment: '交易hash，On Chain类型才有',
      },
    },
    {
      tableName: 'isting_transaction',
    }
  );

  IstingTransaction.addRecord = async function (param, value) {
    const data = await this.findCreateFind({
      where: param,
      defaults: value,
    });
    return data;
  };

  return IstingTransaction;
};
