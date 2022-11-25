import UrlService from '../services/UrlService';
// import { SuccessHandlerUtil } from '../utils';

export default class UrlsController {
  static async getAllUrls(req, res, next) {
    try {
      const { offset, limit } = req.params;
      const url = await UrlService.checkUrls(offset, limit);
      // console.log(url, 45454545);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUrlss() {
    for (let i = 0; i < 1000000; i++) {
      console.log(i);
    }
  }
}
