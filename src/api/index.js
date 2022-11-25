import express from 'express';

import UrlsController from '../controller/urls.controller';

const router = express.Router();

router.get('/urls/:offset/:limit', UrlsController.getAllUrls);
router.get('/urls/test', UrlsController.getAllUrlss);

export default router;
