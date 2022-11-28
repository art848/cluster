// Standard modules
import http from 'http';
import 'dotenv/config';
import 'regenerator-runtime';

// Modules from this project
import cluster from 'cluster';
import { LoggerUtil } from '../utils';
import App from '../app';
import UrlService from '../services/UrlService';
import { UrlsModel } from '../models';
// Constants
import config from '../config/variables.config';
import { name } from '../../package.json';

const { PORT } = config;
// app.use(express).listen(PORT);

const init = async () => {
  const server = http.createServer(App.app);

  App.init();
  const _onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof App.port === 'string' ? `Pipe ${App.port}` : `Port ${App.port}`;
    switch (error.code) {
      case 'EACCES':
        LoggerUtil.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        LoggerUtil.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  const _onListening = () => {
    const address = server.address();
    const bind = typeof address === 'string'
      ? `pipe ${address}`
      : `${address.port}`;

    LoggerUtil.info(`${name} started:`);
    LoggerUtil.info(`\tPort: ${bind}`);
    LoggerUtil.info(`\tEnvironment: ${App.env}`);
    LoggerUtil.info(`\tNode version: ${process.version}`);
    LoggerUtil.info(`\tStart date: ${(new Date()).toUTCString()} \n`);
  };
  server.listen(PORT);
  server.on('error', _onError);
  server.on('listening', _onListening);
};
const total_cpus = require('os').cpus().length;
let urls = []
let element = [];

async function isPrimary() {

  if (cluster.isPrimary) {
    urls = await UrlsModel.getUrls(8600,200);
    const worker = cluster.fork();
    for (let i = 0; i < total_cpus - 2; i += 1) {
      cluster.fork()
    }
      for (let step = 0; step < urls.length; step += 5) {
        element = urls.slice(step, step + 5);
        worker.send(element);
      }

      worker.on("message", (msg) => {
        // check for data property
        // on msg object
        if (msg.data) {
        }
      });

    cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online.`);
    });


    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died.`);
      cluster.fork();
    });

  } else {
    process.on('message', async function (msg) {
      // we only want to intercept messages that have a chat property
      process.send({data : await UrlService.checkUrls(msg)});
    });
  }
}
isPrimary();

