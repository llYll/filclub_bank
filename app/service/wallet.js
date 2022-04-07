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
}

module.exports = WalletService;
