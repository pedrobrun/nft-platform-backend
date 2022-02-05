import e from 'express';
import express, {Request as Req, Response as Res} from 'express';
import multer from 'multer';
import { multerConfig } from './multer';
import {NftImageService} from './NftImageService';
import {checkToken} from "../middlewares/jwt";
import { ErrorMessages } from './Enums';

export const nftImageRouter = express.Router();

const nftImageService = new NftImageService();

nftImageRouter.post('/', multer(multerConfig).single("file"), checkToken, async (req : Req, res : Res) => {
  
  const { size, key, location: url } = req.file;

  console.log(req.file)
  if (!req.body) {
      res.status(400).send({ msg: ErrorMessages.NO_DATA});
  }

  const nftImage = await nftImageService.createNftImage({
    key,
    size,
    url
  });

  return res.json(nftImage);
});

nftImageRouter.get('/', async (req: Req, res: Res) => {
  const nftImages = await nftImageService.getAll();
  res.json(nftImages);
  return nftImages;
});