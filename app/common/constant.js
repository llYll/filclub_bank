'use strict';

module.exports = {
  WALLET_STATUS: {
    INIT: 0,
    ALLOCATED: 1,
    DISABLE: 2,
  },

  RECHARGE_STATUS: {
    INIT: 0,
    SEND: 1,
    DISABLE: 2,
  },

  BORROW_STATUS: {
    INIT: 0,
    SUCCESS: 1,
    FAILED: 2,
  },

  VERIFICATION_TYPE: {
    SUBMIT: 1,
    LOGIN: 2,
  },

  TRANSACTION_TYPE: {
    RECHARGE: 1,
    MINER: 2,
    WITHDRAW: 3,
  },
  TRANSACTION_METHOD: {
    Send: 0,
    SubmitWindowedPoSt: 5,
    PreCommitSector: 6,
    ProveCommitSector: 7,
  },
  //错误码
  ERROR_CODE: {
    APPLICATION_NOT_EXIST: -10000,
  },

  //错误信息
  ERROR_MESSAGE: {
    APPLICATION_NOT_EXIST: '应用不存在',
  },
};
