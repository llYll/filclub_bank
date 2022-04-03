const amqplib = require('amqplib');

const Service = require('egg').Service;

class AmqpService extends Service {
  async send(key, msg) {
    try {
      msg = JSON.stringify(msg);

      const { OPTIONS, EXCHANGE_TYPE, EXCHANGE_NAME } = this.config.RABBITMQ_CONFIG;
      const conn = await amqplib.connect(OPTIONS);

      const ch = await conn.createChannel();
      // 声明交换机
      let ok = ch.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE.direct, {
        durable: true,
      });

      return ok.then(() => {
        // 向交换机指定路由发送信息
        ch.publish(EXCHANGE_NAME, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s' ", key, msg);
        ch.close();
        return;
      });
    } catch (e) {
      throw e;
    }
  }
}

module.exports = AmqpService;
