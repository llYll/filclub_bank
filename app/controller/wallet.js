'use strict';

const BaseController = require('./base');

class WalletController extends BaseController {
  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async allocate() {
    const { config, ctx } = this;
    const { constant } = config;
    const { app_key, app_secret, coinType } = ctx.request.body;
    const application = await ctx.model.Application.findApplication(app_key, app_secret);
    if (!application) {
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST
      );
      return;
    }
    let wallet = {
      usdtErcWallet: '',
      usdtTrcWallet: '',
      filWallet: '',
    };
    if(!coinType) {
      wallet.usdtErcWallet = await ctx.service.wallet.allocate(application, 1);
      wallet.usdtTrcWallet = await ctx.service.wallet.allocate(application, 2);
      wallet.filWallet = await ctx.service.wallet.allocate(application, 3);
    } else {
      wallet.wallet = await ctx.service.wallet.allocate(application, coinType);
    }
    this.success({ wallet });
  }

  async test() {
    // const {to,from,value,blockCid,dealCid,height} = this.ctx.query;
    // const result = await this.ctx.service.amqp.send(
    //   'dc_pool',
    //   JSON.stringify({
    //     to,
    //     from,
    //     value,
    //     blockCid,
    //     dealCid,
    //     height,
    //     coinType:1
    //   })
    // );
    // this.success(result);
    this.success();
  }

  async getIstringWallet() {
    this.success();
    return ;
    const { ctx, service } = this;
    const { number, coinName, appId } = ctx.request.body;
    const data = await service.istring.createAddress(number, coinName, appId);
    this.success(data);
  }
}

module.exports = WalletController;
