'use strict';

const Service = require('egg').Service;
const Istring = require('istring-lib');

const TRADE_ENUM = {
  COLLECTION: 1,
  TRANSFER: 2,
};

const TX_STATUS = {
  WAITING_PROCESS: 0,
  WAITING_PACKAG: 1,
  IN_PACKAG: 2,
  SUCCESS: 3,
  FAILURE: 4,
  CANCEL: 5,
  REFUSED: 6,
};

const BUSINESS_TYPE = {
  ON_CHAIN: 1,
  OFF_CHAIN: 2,
};

class IstingService extends Service {
  constructor(ctx) {
    super(ctx);
    const { apiKey, platformPublicKey, charEncode, privatePath } = this.config.istring;
    this.istringClient = new Istring({
      apiKey,
      platformPublicKey,
      charEncode,
      privatePath,
    });
  }

  async record(data) {
    const requestObje = this.istringClient.getRequestParam(data);
    this.ctx.logger.info(requestObje);
    let {
      tradeType,
      businessType,
      coinName,
      uniqTradeNo,
      tradeNo,
      tradeAmount,
      tradeFee,
      fromAddress,
      toAddress,
      txStatus,
      blockHeight,
      txHash,
    } = requestObje;

    txStatus = Number.parseInt(txStatus);
    tradeType = Number.parseInt(tradeType);

    if (txStatus !== TX_STATUS.SUCCESS) {
      throw new Error('交易状态错误');
    }

    // 收款
    if (tradeType !== TRADE_ENUM.COLLECTION) {
      throw new Error('交易方式暂不支持');
    }

    if (coinName === 'USDT_TRC20') {
      const params = {
        type: tradeType,
        businessType,
        coinName,
        uniqTradeNo,
        tradeNo,
        tradeAmount,
        tradeFee,
        from: fromAddress,
        to: toAddress,
        txStatus,
        blockHeight,
        txHash,
      };

      // 获取地址
      const walletRes = await this.ctx.model.Wallet.findOne({
        where: {
          wallet: toAddress,
        },
        attributes: ['appId'],
        raw: true,
      });

      if (!walletRes) {
        // 地址不存在
        return;
      }
      const { appId } = walletRes;
      const appRes = await this.ctx.model.Application.findByPk(appId, {
        attributes: ['name'],
        raw: true,
      });
      if (!appRes) {
        return;
      }
      const { name } = appRes;
      await this.ctx.model.IstringTransaction.addRecord(params, {
        blockHeight,
        txStatus,
      });
      await this.ctx.service.amqp.send(name, {
        from: fromAddress,
        to: toAddress,
        value: tradeAmount,
        fee: tradeFee,
        blockHeight,
        coinType: 2,
        txHash,
      });
      return true;
    }
    return true;
  }

  async createAddress(number, coinName, appId) {
    let istringCoinName = '';
    if (coinName === 'USDT(TRC20)') {
      istringCoinName = 'TRX';
    }
    const res = await this.istringClient.createAddress(istringCoinName, number);
    const { code, data, errMsg } = res;
    if (code !== '20000') {
      throw new Error(errMsg);
    }

    const promiseArr = [];
    for (const address of data) {
      promiseArr.push({
        appId,
        wallet: address,
        coinType: 2,
      });
    }

    await this.app.model.Wallet.bulkCreate(promiseArr);

    return true;
  }
}

module.exports = IstingService;
