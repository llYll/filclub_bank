module.exports = app => {
  // 开始前执行
  app.beforeStart(async () => {

  });
  // 准备好执行
  app.ready(async () => {
    const ctx = app.createAnonymousContext();
    // preload before app start
    await ctx.service.wallet.delRedisWallet();
    await ctx.service.wallet.initRedisWallet();
    while (true) {
      await ctx.service.lotusMonitor.rechargeMonitor();
    }
  });
  // 关闭前执行
  app.beforeClose(async () => {

  });
};
