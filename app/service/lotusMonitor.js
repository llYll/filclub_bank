const Service = require('egg').Service;
const { HttpJsonRpcConnector, JsonRpcProvider } = require('filecoin.js');
const dayjs = require('dayjs');
//定义 grpc参数
let httpConnector;
let jsonRpcProvider;

function packageTransaction(crtBlock, message, dealcid, blockHeight) {
  const {
    Version,
    To,
    From,
    Nonce,
    Value,
    GasLimit,
    GasFeeCap,
    GasPremium,
    Method,
    Params,
    CID,
  } = message;
  const dealCid = dealcid['/'];
  const blockCid = crtBlock['/'];
  const param = {
    dealCid: dealCid,
  };

  const values = {
    version: Version,
    to: To,
    from: From,
    nonce: Nonce,
    value: Value,
    gasLimit: GasLimit,
    gasFeeCap: GasFeeCap,
    gasPremium: GasPremium,
    method: Method,
    blockCid: blockCid,
    height: blockHeight,
    params: Params,
    dealCid: dealCid,
  };
  return { param, values };
}

class LotusMonitorService extends Service {
  /**
   * 用户充值接听监听
   * @returns {Promise<void>}
   */
  async rechargeMonitor() {
    //获取上次监听的区块高度
    const heightInfo = await this.ctx.model.BlockHeight.getHeightInfo();
    const blockHeight = heightInfo.currentHeight;
    if (heightInfo.currentHeight > heightInfo.latestHeight - 30) {
      return;
    }
    const url = this.config.lotus.url;
    const token = this.config.lotus.token;
    if (!httpConnector || !jsonRpcProvider) {
      console.log('新的连接');
      httpConnector = new HttpJsonRpcConnector({ url, token });
      jsonRpcProvider = new JsonRpcProvider(httpConnector);
    }
    try {
      //高度 tipset 查询
      const tipSet = await jsonRpcProvider.chain.getTipSetByHeight(blockHeight);

      const { Cids: blockCids } = tipSet;

      let transactionCount = 0;
      for (let i = 0; i < blockCids.length; i++) {
        const crtBlock = blockCids[i];
        const reason = await jsonRpcProvider.sync.checkBad(crtBlock); // 应该检查一个块是否被标记为 bad
        if (!reason) {
          // 根据 blockCid 获取指定区块消息
          const blockMessages = await jsonRpcProvider.chain.getBlockMessages(crtBlock);
          const { BlsMessages, SecpkMessages } = blockMessages;

          //查找BlsMessages地址
          for (const transaction of BlsMessages) {
            const recharge = await this.recording(crtBlock, transaction, blockHeight, transaction.CID);
            // const minerRecord = await this.recordingMiner(crtBlock, transaction);
            if (recharge) transactionCount++;
          }

          //查找SecpkMessages地址
          for (let j = 0; j < SecpkMessages.length; j++) {
            const recharge = await this.recording(
              crtBlock,
              SecpkMessages[j].Message,
              blockHeight,
              SecpkMessages[j].CID
            );
            // const minerRecord = await this.recordingMiner(crtBlock, SecpkMessages[j].Message);
            if (recharge) transactionCount++;
          }
        } else {
          throw reason;
        }
      }
      this.ctx.logger.info(`${blockHeight} 高度，成功监听到钱包充值交易 ${transactionCount} 笔`);
      console.log(`${blockHeight} 高度，成功监听到钱包充值交易 ${transactionCount} 笔`);
      let nowheight = blockHeight + 1;
      await this.ctx.model.BlockHeight.setCurrentHeight(heightInfo.id, nowheight);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 检测某个高度区块信息
   * @returns {Promise<void>}
   */
  async checkHeightDealInfo(height) {
    const url = this.config.lotus.url;
    const token = this.config.lotus.token;
    console.log(height);
    console.log('lotus 连接>>>>>>>>', url, token);
    if (!httpConnector || !jsonRpcProvider) {
      console.log('新的连接');
      httpConnector = new HttpJsonRpcConnector({ url, token });
      jsonRpcProvider = new JsonRpcProvider(httpConnector);
    }
    try {
      //高度 tipset 查询
      const tipSet = await jsonRpcProvider.chain.getTipSetByHeight(height);

      const { Cids: blockCids } = tipSet;

      let transactionCount = 0;
      for (let i = 0; i < blockCids.length; i++) {
        const crtBlock = blockCids[i];
        const reason = await jsonRpcProvider.sync.checkBad(crtBlock); // 应该检查一个块是否被标记为 bad
        if (!reason) {
          // 根据 blockCid 获取指定区块消息
          const blockMessages = await jsonRpcProvider.chain.getBlockMessages(crtBlock);
          const { BlsMessages, SecpkMessages } = blockMessages;

          //查找BlsMessages地址
          for (const transaction of BlsMessages) {
            const recharge = await this.recording(crtBlock, transaction, height, transaction.CID);
            if (recharge) transactionCount++;
          }

          //查找SecpkMessages地址
          for (let j = 0; j < SecpkMessages.length; j++) {
            const recharge = await this.recording(
              crtBlock,
              SecpkMessages[j].Message,
              height,
              SecpkMessages[j].CID
            );
            if (recharge) transactionCount++;
          }
        } else {
          throw reason;
        }
      }
      this.ctx.logger.info(`${height} 高度，成功监听到钱包充值交易 ${transactionCount} 笔`);
      console.log(`${height} 高度，成功监听到钱包充值交易 ${transactionCount} 笔`);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 同步区块高度
   * @returns {Promise<void>}
   */
  async syncHeight() {
    const heightInfo = await this.ctx.model.BlockHeight.getHeightInfo();
    const url = this.config.lotus.url;
    const token = this.config.lotus.token;
    if (!httpConnector || !jsonRpcProvider) {
      console.log('新的连接');
      httpConnector = new HttpJsonRpcConnector({ url, token });
      jsonRpcProvider = new JsonRpcProvider(httpConnector);
    }
    const state = await jsonRpcProvider.sync.state(); // 返回lotus同步系统的当前状态。
    if (Array.isArray(state.ActiveSyncs)) {
      const { Height: latest_height } = state.ActiveSyncs[0];
      // 更新最新区块高度
      await this.ctx.model.BlockHeight.setLatestHeight(heightInfo.id, latest_height);
      this.ctx.logger.info(`lotus 高度节点同步正常，已同步到 ${latest_height}`);
      console.log(`lotus 高度节点同步正常，已同步到 ${latest_height}`);
    }
  }

  /**
   * 记录链上充值信息
   * @param message
   * @returns {Promise<*>}
   */
  async recording(crtBlock, message, height = 0, dealCid) {
    try {
      const url = this.config.lotus.url;
      const token = this.config.lotus.token;
      if (!httpConnector || !jsonRpcProvider) {
        console.log('新的连接');
        httpConnector = new HttpJsonRpcConnector({ url, token });
        jsonRpcProvider = new JsonRpcProvider(httpConnector);
      }
      let { param, values } = packageTransaction(crtBlock, message, dealCid, height);
      if (!values.to) return;
      if (values.method !== 0) return;

      // 查找目标地址是充值地址的接口
      if (height > 0) {
        values.height = height;
      }
      const wallet = await this.ctx.helper.getKey(`wallet:${values.to}`);
      if (!wallet) return;

      const constant = this.config.constant;

      const  state = await jsonRpcProvider.state.searchMsg(dealCid);
      const code = state.Receipt.ExitCode;
      if (code !== 0) {
        console.log("交易失败：", dealCid);
        return;
      }

      if (wallet) {
        values.type = constant.TRANSACTION_TYPE.RECHARGE;
      }
      const record = await this.ctx.model.Transaction.addRecord(param, values);
      if (!record[1]) return [0];
      // const minerAmount = this.ctx.helper.unitAmount(values.value);
      // if(minerAmount < 1){
      //   return ;
      // }
      if (wallet) {
        const application = await this.ctx.model.Application.findByPk(1);
        await this.ctx.service.amqp.send(application.name, {
          to: record[0].to,
          from: record[0].from,
          hash: record[0].dealCid,
          amount: record[0].value,
          height: record[0].height,
          type: 'fil',
          chain: 'fil',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
        await this.ctx.model.Transaction.sendRecord(record[0].id);
        return record[0];
      }
    } catch (e) {
      console.error("lotus 错误: ", e);
      this.ctx.logger.error("lotus 错误:", e);
      throw new Error("lotus 超时");
    }
  }

  /**
   * 记录链上miner信息
   * @param message
   * @returns {Promise<*>}
   */
  async recordingMiner(crtBlock, message, height) {
    const { param, values } = packageTransaction(crtBlock, message);

    if (!values.to) return;
    // 查找目标地址是充值地址的接口
    const miner = await this.ctx.model.Miner.findByMiner(values.to);
    const constant = this.config.constant;

    if (!miner) return;

    if (
      values.method < constant.TRANSACTION_METHOD.SubmitWindowedPoSt ||
      values.method > constant.TRANSACTION_METHOD.ProveCommitSector
    )
      return;

    values.type = constant.TRANSACTION_TYPE.MINER;
    const record = await this.ctx.model.MinerTransaction.addRecord(param, values);
    return record[0];
  }
}

module.exports = LotusMonitorService;
