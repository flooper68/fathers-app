const { createProxyMiddleware } = require('http-proxy-middleware')

const target = 'http://localhost:3002'

module.exports = function (app) {
  app.use(createProxyMiddleware('/styles.css', { target }))
  app.use(createProxyMiddleware('/api', { target }))
}
