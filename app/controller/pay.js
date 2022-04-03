'use strict';

const BaseController = require('./base');

class PayController extends BaseController {
  // 充值回调
  async record() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.istring.record(data);
    this.success(res);
  }
}
module.exports = PayController;
