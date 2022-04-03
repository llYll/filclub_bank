'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Miner = app.model.define('miner', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    miner: {
      type: STRING(255),
      unique: true,
      allowNull: false,
      comment: "钱包地址",
    },
    status: {
      type: INTEGER(11),
      defaultValue: 1,
      comment: " 1:使用  2: 禁止"
    }
  },{
    tableName: 'miner'
  });


  /**
   * 查找某一个miner
   * @param wallet
   * @returns {Promise<TInstance>}
   */
  Miner.findByMiner= async function(miner) {
    return await this.findOne( {
      where: {
        miner
      },
    })
  }


  return Miner;
};
