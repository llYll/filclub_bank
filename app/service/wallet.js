const Service = require('egg').Service;

class WalletService extends Service {
  async allocate(application, coinType) {
    let walletList = [];
    const walletInfo = await this.ctx.model.Wallet.getUnallocatedWallet(coinType);
    if(!walletInfo){
      return '';
    }
    walletList.push(walletInfo.wallet);
    await this.ctx.model.Wallet.allocatedWallet(application.id, walletList);
    return walletInfo.wallet;
  }

  async initRedisWallet(){
    const { ctx } = this;
    const walletInfos = await this.ctx.model.Wallet.findAll({
      where: {
        coinType: 3
      }
    });
    for (let wallet of walletInfos) {
      await ctx.helper.setKey(`wallet:${wallet.wallet}`, wallet);
    };
    return ;
  }

  async delRedisWallet(){
    const res = await this.app.redis.keys("wallet:*");
    if(res.length > 0) {
      await this.ctx.helper.delRedis(res);
    }
    return ;
  }
}

module.exports = WalletService;
