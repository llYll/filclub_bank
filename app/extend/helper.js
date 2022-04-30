const Bignumber = require('bignumber.js')
const _ = require('lodash');

module.exports = {
  unitAmount(number, decimal = 18) {
    number = new Bignumber(number);
    decimal = new Bignumber(Math.pow(10, decimal));
    const price = number.dividedBy(decimal).toNumber();
    return price;
  },

  TelFormat(phone) {
    const myreg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      return false;
    }
    return true;
  },

  checkPositiveNumber(number) {
    const re = /^\d+(?=\.{0,1}\d+$|$)/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
    if (!re.test(number)) {
      return false;
    }
    return true;
  },

  /**
   * @description 大数相加
   * @param {string|number} numberA
   * @param {string|number} numberB
   * @returns {number} res
   */
  bigAdd(numberA, numberB) {
    const a = new Bignumber(numberA);
    const b = new Bignumber(numberB);
    const res = a.plus(b).toNumber();
    return res;
  },

  /**
   * @description 大数相减
   * @param {string|number} numberA
   * @param {string|number} numberB
   * @returns {number} res
   */
  bigMinus(numberA, numberB) {
    const a = new Bignumber(numberA);
    const b = new Bignumber(numberB);
    const res = a.minus(b).toNumber();
    return res;
  },

  /**
   * @description 大数相乘
   * @param {string|number} numberA
   * @param {string|number} numberB
   * @returns {number} res
   */
  bigMult(numberA, numberB) {
    const a = new Bignumber(numberA);
    const b = new Bignumber(numberB);
    const res = a.multipliedBy(b).toNumber();
    return res;
  },

  /**
   * @description 大数相除
   * @param {string|number} numberA
   * @param {string|number} numberB
   * @returns {number} res
   */
  bigDiv(numberA, numberB) {
    numberB = Number.parseFloat(numberB);

    if (numberB === 0) return 0;

    const a = new Bignumber(numberA);
    const b = new Bignumber(numberB);
    const res = a.dividedBy(b).toNumber();
    return res;
  },

  /**
   * 设置redis值
   * @param {String} key
   * @param {Object|String} value
   * @param {Number} time 过期时间
   * @return {}
   */
  async setKey(key, value, time) {
    if (_.isObject(value)) {
      value = JSON.stringify(value);
    }
    if (time) {
      await this.app.redis.set(key, value, 'EX', time);
    } else {
      await this.app.redis.set(key, value);
    }
  },

  /**
   * 获取redis值
   * @param {String} key
   * @return {Promise<Object|String>}
   */
  async getKey(key) {
    return new Promise(async (resolve, reject) => {
      await this.app.redis.get(key, (err, result) => {
        if (err) {
          reject(err);
        }

        try {
          resolve(JSON.parse(result));
        } catch (e) {
          resolve(result);
        }
      });
    });
  },
  async delRedis(key){
    await this.app.redis.del(key);
  }
};
