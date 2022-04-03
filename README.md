# DC_BANK

## 测试url：  http://47.110.93.253:7001

钱包地址：

先把钱包地址读出放入内存（Map）

定时器：
1.从数据库 读出当前高度 最新高度 开始遍历

2.lotus获取指定高度tipset所有blockcid
  
  遍历blockcid
  
  检查block 是否bad
  
  获取block信息。
  

3. 通过 method = 0 过滤挖矿信息

4. 判断 TO地址是否属于我们钱包

5。判断 deal_id 是否有存储

try{
 没存储(事务)：
  1.插入数据库
  2.发送rabbitmq
  3.更改监听状态的信息 改成已发送
 已存储：
   continue;
   
  更新读取高度。
 }catch(e){
  //异常重新执行第2步
 }   
