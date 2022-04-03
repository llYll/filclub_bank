const BaseController = require('./base')

class UserController extends BaseController{

  /**
   * 发送验证码
   * @returns {Promise<void>}
   */
  async sendVerify(){
    const { ctx } = this;
    const { tel, type } = ctx.request.body;
    const constant = this.config.constant;
    if(!tel){
      this.failed(
        constant.ERROR_CODE.PARAM_ERROR,
        constant.ERROR_MESSAGE.PARAM_ERROR);
      return;
    }

    if(!ctx.helper.TelFormat(tel)){
      this.failed(
        constant.ERROR_CODE.TEL_ERROR_FORMAT,
        constant.ERROR_MESSAGE.TEL_ERROR_FORMAT);
      return;
    }
    let key = `submit:${tel}`;

    switch (type) {
      case constant.VERIFICATION_TYPE.SUBMIT:
        key = `submit:${tel}`;
        break;
      case constant.VERIFICATION_TYPE.LOGIN:
        key = `login:${tel}`;
        break;
      default:
        break;

    }
    const number = Math.random().toFixed(8).slice(-8);

    let param = {
      code: number,
      error: 0
    }
    await ctx.helper.setRedis(key,param);
    try {
      const result = await ctx.service.aliyun.sms.sendSMS('CN',tel,{ number });
      if(!result){
        this.failed(
          constant.ERROR_CODE.TEL_VERIFY_SEND_ERROR,
          constant.ERROR_MESSAGE.TEL_VERIFY_SEND_ERROR);
        return;

      }
      this.success({ msg: '短信发送成功' });
    }catch (e) {
      console.log(e);
      this.ctx.logger.error(e);
      this.failed(
        constant.ERROR_CODE.TEL_VERIFY_SEND_ERROR,
        constant.ERROR_MESSAGE.TEL_VERIFY_SEND_ERROR);
      return;
    }
  }

  /**
   * 登录
   * @returns {Promise<void>}
   */
  async login() {
    const { ctx, app } = this;
    const { tel, code } = ctx.request.body;
    const constant = this.config.constant;

    if(!tel || !code){
      this.failed(
        constant.ERROR_CODE.PARAM_ERROR,
        constant.ERROR_MESSAGE.PARAM_ERROR);
      return;
    }

    if(!ctx.helper.TelFormat(tel)){
      this.failed(
        constant.ERROR_CODE.TEL_ERROR_FORMAT,
        constant.ERROR_MESSAGE.TEL_ERROR_FORMAT);
      return;
    }

    let key = `login:${tel}`;
    const correct = await ctx.helper.getRedis(key);

    if(!correct){
      this.failed(
        constant.ERROR_CODE.TEL_VERIFY_NULL,
        constant.ERROR_MESSAGE.TEL_VERIFY_NULL);
      return;
    }


    //手机验证码
    if(correct.code != code){
      correct.error ++;
      if(correct.error === 5){
        await ctx.helper.delRedis(key);
        this.failed(
          constant.ERROR_CODE.TEL_VERIFY_ERRORMANY,
          constant.ERROR_MESSAGE.TEL_VERIFY_ERRORMANY);
        return;
      }
      await ctx.helper.setRedis(key,correct);
      this.failed(
        constant.ERROR_CODE.TEL_VERIFY_ERROR,
        constant.ERROR_MESSAGE.TEL_VERIFY_ERROR);
      return;
    }
    const user = await ctx.model.User.findByTel(tel);
    if(!user){
      this.failed(
        constant.ERROR_CODE.USER_NOT_EXIST,
        constant.ERROR_MESSAGE.USER_NOT_EXIST);
      return;
    }
    const token = app.jwt.sign({
      id: user.id,
      tel: user.tel,
      nickname: user.nickname,
    }, app.config.jwt.secret);
    this.success({ token });
  }
}

module.exports = UserController;
