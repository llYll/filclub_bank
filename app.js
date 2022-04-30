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
    process.nextTick(async ()=>{
      while (true) {
        try {
          await ctx.service.lotusMonitor.rechargeMonitor(1);
        } catch (e) {
          console.log(e);
        }
      }
    })
    process.nextTick(async ()=>{
      while (true) {
        try {
          await ctx.service.lotusMonitor.rechargeMonitor(2);
        } catch (e) {
          console.log(e);
        }
      }
    })
  });
  // 关闭前执行
  app.beforeClose(async () => {

  });
};
