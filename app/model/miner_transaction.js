'use strict';

module.exports = app => {
  const { STRING, INTEGER,TEXT } = app.Sequelize;

  const MinerTransaction = app.model.define('minerTransaction', {
    id: {
      type: INTEGER(10),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    type: {
      type: INTEGER(10),
      allowNull: false,
      defaultValue: 1,
      comment: '交易类型1.充值 2.miner信息 3.提现记录',
    },
    version: {
      type: INTEGER(10),
      allowNull: false,
      comment: '',
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
    method: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      comment: '交易类型',
    },
    params: {
      type: TEXT,
      allowNull: true,
      comment: '参数',
    },
    status: {
      type: INTEGER(11),
      defaultValue: 0,
      comment: " 0: 未使用  1:已使用  2: 禁止"
    },
    nonce: {
      type: INTEGER,
      allowNull: false,
      comment: 'Nonce',
    },
    value: {
      type: STRING(255),
      allowNull: false,
      comment: '金额',
    },
    gasLimit: {
      type: INTEGER,
      allowNull: true,
      comment: '该笔交易能消耗的最大Gas量',
    },
    gasFeeCap: {
      type: STRING(255),
      allowNull: true,
      comment: '根据区块链网络拥堵状况实时更新的基础手续费率',
    },
    gasPremium: {
      type: STRING(255),
      allowNull: false,
      comment: '用户选择支付给矿工的手续费率',
    },
    blockCid: {
      type: STRING(255),
      allowNull: false,
      comment: '区块 cid',
    },
    dealCid: {
      type: STRING(255),
      unique: true,
      allowNull: false,
      comment: '消息 cid',
    },
    height: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      comment: '区块高度',
    }
  },{
    tableName: 'miner_transaction'
  });

  //之后改成分页
  MinerTransaction.getRecordByWallet = async function(wallet) {
    return await this.findAll( {
      where: {
        to: wallet
      }
    })
  }

  MinerTransaction.findRecord = async function(param) {
    return await this.findOne( {
      attributes: ['to','from','value','blockCid','dealCid','height'],
      where: param,
    })
  }

  MinerTransaction.addRecord = async function(param,value) {
    const data = await this.findCreateFind({
      where: param,
      defaults: value,
    });
    return data;
  }

  MinerTransaction.sendRecord = async function(id) {
    const data = await this.update({
      status: 1
    },{
      where: { id }
    });
    return data;
  }

  return MinerTransaction;
};
