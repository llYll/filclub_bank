const Service = require('egg').Service;

class WalletService extends Service {
  async allocate(application, number) {
    let walletList = [];
    const usdtErcWallet = await this.ctx.model.Wallet.getUnallocatedWallet(number, 1);
    const usdtTrcWallet = await this.ctx.model.Wallet.getUnallocatedWallet(number, 2);
    const filWallet = await this.ctx.model.Wallet.getUnallocatedWallet(number, 3);
    if(usdtErcWallet){
      walletList.push(usdtErcWallet);
    }
    if(usdtTrcWallet){
      walletList.push(usdtTrcWallet);
    }
    if(filWallet){
      walletList.push(filWallet);
    }
    await this.ctx.model.Wallet.allocatedWallet(application.id, walletList);

    return {
      usdtErcWallet,
      usdtTrcWallet,
      filWallet
    };
  }
}

module.exports = WalletService;
