import fetch from 'node-fetch';
import PSQL from '../config/variables.config';

const {
  PORT, HOST, DATABASE, USER, PASSWORD
} = PSQL.PSQL;

let arr = 0;
class UrlService {
  static async checkUrls(urls) {
    const items = urls.map((ur) => (`https://${ur.domain}`));
    const of = urls.map((id) => id.id);
    const res = await Promise.allSettled(items.map((url) => fetch(url)));
    const fulfilledUrl = [];
    const rejectedUrl = [];
    for (let i = 0; i < of.length; i += 1) {
      if (res[i].status !== 'fulfilled') {
        rejectedUrl.push(of[i]);
      } else {
        fulfilledUrl.push(of[i]);
      }
    }
    // console.log(res);
    arr += fulfilledUrl.length + rejectedUrl.length
    console.log('fulfilled =>', fulfilledUrl);
    console.log('rejectedUrl =>', rejectedUrl);
    console.log(arr);
    const count = [];
    const knex = require('knex')({
      client: 'pg',
      useNullAsDefault: true,
      connection: {
        port: PORT,
        host: HOST,
        database: DATABASE,
        user: USER,
        password: PASSWORD
      }
    });
    // if (rejectedUrl.length > 0) {
    //   knex
    //     .from('links')
    //     .whereIn('id', rejectedUrl)
    //     .update({ status: 'passive' })
    //     .then(() => {
    //       console.log('Table update');
    //     });

    //   if (fulfilledUrl.length > 0) {
    //     knex
    //       .from('links')
    //       .whereIn('id', fulfilledUrl)
    //       .update({ status: 'active' })
    //       .then(() => {
    //         console.log('Table update');
    //       });
    //   }
    // }
  }
}
export default UrlService;