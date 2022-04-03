'use strict';

module.exports = app => {
  const { STRING, INTEGER, DECIMAL, Op } = app.Sequelize;

  const Price = app.model.define('price', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    transaction: {
      type: STRING(255),
      allowNull: false,
      comment: "交易对"
    },
    price:{
      type: DECIMAL(30.18),
      defaultValue: 0,
      allowNull: false,
      comment: "币价",
    }
  },{
    tableName: 'Price'
  });


  return Price;
};
