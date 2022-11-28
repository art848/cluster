// NPM Modules  
import PSQL from '../config/variables.config';
import PSQLStorage from '../storage/psql.storage';

const {
  PORT, HOST, DATABASE, USER, PASSWORD
} = PSQL.PSQL;
// import PSQLStorage from '../storage/psql.storage';

class UrlsModel {
  // // Methods

  static async getUrls(offset, limit) {
    // const knex = PSQLStorage
    // console.log(knex);
    // PSQLStorage.init()
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

    const urls = await knex
      .from('links')
      .select('domain', 'id')
      .orderBy('id')
      .offset(offset)
      .limit(limit)
      .then((rows) => rows);

    return urls;
  }
}
export default UrlsModel;
