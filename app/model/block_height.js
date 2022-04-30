'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const BlockHight = app.model.define(
    'blockHeight',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: '主键',
      },
      latestHeight: {
        type: INTEGER(11),
        defaultValue: 1,
        comment: ' 最新区块高度',
      },
      currentHeight: {
        type: STRING(255),
        comment: '当前检查到的区块高度',
      },
      behind: {
        type: INTEGER(10),
        defaultValue: 30,
        comment: '落后高度',
      },
    },
    {
      tableName: 'block_height',
    }
  );

  /**
   * 获取最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.getHeightInfo = async function (where, option) {
    const res = await this.findOne({
      where,
      ...option,
    });
    return res;
  };

  /**
   * 更新最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.setLatestHeight = async function (id, height) {
    await this.update(
      {
        latestHeight: height,
      },
      {
        where: {
          id,
        },
      }
    );
  };

  /**
   * 更新最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.setCurrentHeight = async function (id, height) {
    await this.update(
      {
        currentHeight: height,
      },
      {
        where: {
          id,
        },
      }
    );
  };
  return BlockHight;
};
