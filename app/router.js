'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/wallet/allocate', controller.wallet.allocate);
  router.post('/api/wallet/getIstringWallet', controller.wallet.getIstringWallet);

  router.post('/api/recharge/records', controller.recharge.records);
  router.post('/api/recharge/blockcid', controller.recharge.getBlockByDeal);
  router.post('/api/recharge/syncrecord', controller.recharge.syncheight);

  router.post('/api/pay/record', controller.pay.record);

  router.get('/test', controller.wallet.test);
};
