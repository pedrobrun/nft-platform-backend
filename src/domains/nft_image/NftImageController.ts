import e from 'express';
import express, {Request as Req, Response as Res} from 'express';
import multer from 'multer';
import { multerConfig } from './multer';
import {NftImageService} from './NftImageService';
import {checkToken} from "../middlewares/jwt";

export const nftImageRouter = express.Router();

// for dependency injection, once there's a repository layer
const nftImageService = new NftImageService();

nftImageRouter.post('/', multer(multerConfig).single("file"), checkToken, async (req : Req, res : Res) => {
  
  const { size, key, location: url } = req.file;

  console.log(req.file)
  if (!req.body) {
      res.status(400).send({ msg: 'No data to register.'});
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