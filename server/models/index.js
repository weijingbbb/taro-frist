module.exports = (app) => {
  // path: 路径
  // callback：回调
  app.use('/ads', require('./ads'))
  app.use('/city', require('./airportList'))
  app.use('/list', require('./list'))
  app.use('/login', require('./login'))
  app.use('/order', require('./orderList'))
}
