"use strict";

var compression = require('compression');
var connect = require('connect');
var convert = require('./convert.js');
var errorHandler = require('errorhandler');
var http = require('http');
var morgan = require('morgan');
var optimist = require('optimist');
var path = require('path');
var reactMiddleware = require('react-page-middleware');
var serveStatic = require('serve-static');

var argv = optimist.argv;

var PROJECT_ROOT = path.resolve(__dirname, '..');
console.log("Proj Root"+PROJECT_ROOT);//DEBUG KWANG
var FILE_SERVE_ROOT = path.join(PROJECT_ROOT, 'src');
console.log("File Root"+FILE_SERVE_ROOT);//DEBUG KWANG
var port = argv.port;
if (argv.$0 === 'node ./server/generate.js') {
  // Using a different port so that you can publish the website
  // and keeping the server up at the same time.
  port = 8079;
}

var buildOptions = {
  projectRoot: PROJECT_ROOT,
  pageRouteRoot: FILE_SERVE_ROOT,
  useBrowserBuiltins: false,
  logTiming: true,
  useSourceMaps: true,
  ignorePaths: function(p) {
    return p.indexOf('__tests__') !== -1;
  },
  serverRender: true,
  dev: argv.dev !== 'false',
  static: true
};

var app = connect()
  .use(function(req, res, next) {
    // convert all the md files on every request. This is not optimal
    // but fast enough that we don't really need to care right now.
    convert();
    next();
  })
  .use(reactMiddleware.provide(buildOptions))
  .use(serveStatic(FILE_SERVE_ROOT))
  .use(morgan('combined')) //logger KWANG
  .use(compression())
  .use(errorHandler());

var portToUse = port || 8080;
var server = http.createServer(app);
//server.listen(portToUse);
console.log("IP:"+ process.env.IP+" PORT:"+process.env.PORT);
server.listen(process.env.PORT, process.env.IP);//cloud9
//console.log('Open https://localhost:' + portToUse + '/relay/index.html');
module.exports = server;
