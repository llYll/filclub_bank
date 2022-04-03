const Service = require('egg').Service;

class WalletService extends Service {
  async allocate(application, number, coinType) {
    const walletsAddress = await this.ctx.model.Wallet.getUnallocatedWallet(number, coinType);
    const walletList = walletsAddress.map(item => item.wallet);
    await this.ctx.model.Wallet.allocatedWallet(application.id, walletList);
    return walletList;
  }
}

module.exports = WalletService;
