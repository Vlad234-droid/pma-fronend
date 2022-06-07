// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware(['/sso', '/api', '/api-docs', '/camunda'], {
      target: `http://localhost:${process.env.NODE_PORT}`,
      changeOrigin: true,
    }),
  );
};
