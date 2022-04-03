const Subscription = require('egg').Subscription;

class SyncHeight extends Subscription {
  static get schedule() {
    return {
      interval: '30s', // 30s 间隔
      type: 'worker', // 随机一个work执行
      disable: false,
    };
  }

  /**
   * 同步区块高度
   * @param ctx
   * @returns {Promise<void>}
   */
  async subscribe(ctx) {
    await this.ctx.service.lotusMonitor.syncHeight();
  }
}
module.exports = SyncHeight;
