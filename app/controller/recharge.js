'use strict';

const BaseController = require('./base');

class RechargeController extends BaseController {
  /**
   * 获取充值记录
   * @returns {Promise<void>}
   */
  async records() {
    const constant = this.config.constant;
    const { wallet, app_key, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_key, app_secret);
    if (!application) {
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST
      );
      return;
    }
    const records = await this.ctx.model.Transaction.getRecordByWallet(wallet);
    this.success({ records });
  }

  async getBlockByDeal() {
    const constant = this.config.constant;
    const { deal_id, app_key, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_key, app_secret);
    if (!application) {
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST
      );
      return;
    }
    const record = await this.ctx.model.Transaction.getRecordByDeal(deal_id);
    this.success({ record });
  }

  async syncheight() {
    const constant = this.config.constant;
    const { height, app_key, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_key, app_secret);
    if (!application) {
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST
      );
      return;
    }
    await this.ctx.service.lotusMonitor.checkHeightDealInfo(height);
    this.success({ msg: '同步中' });
  }
}

module.exports = RechargeController;
