/* eslint-disable array-callback-return */
import fetch from 'node-fetch';
import { UrlsModel } from '../models';
import PSQLStorage from '../storage/psql.storage';
import config from '../config/variables.config';

class UrlService {
  static async checkUrls(offset, limit) {
    const urls = await UrlsModel.getUrls(offset, limit);

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
    console.log('fulfilled =>', fulfilledUrl);
    console.log('rejectedUrl =>', rejectedUrl);
    const { knex } = PSQLStorage;

    if (rejectedUrl.length > 0) {
      knex
        .from('links')
        .whereIn('id', rejectedUrl)
        .update({ status: 'passive' })
        .then(() => {
          console.log('Table update');
        });
    }

    if (fulfilledUrl.length > 0 && config) {
      knex
        .from('links')
        .whereIn('id', fulfilledUrl)
        .update({ status: 'active' })
        .then(() => {
          console.log('Table update');
        });
    }
  }
}

export default UrlService;
