import express, {Express, Request as Req, Response as Res} from "express";
import {checkToken} from "../middlewares/jwt";
import {NftService} from "./NftService"
import { NftImageService } from "../nft_image/NftImageService";
import multer from "multer";
import { multerConfig } from "../nft_image/multer";
import { urlencoded } from "body-parser";
import { SuccessMessages, ErrorMessages } from './Enums'
import cors from "cors";

export const nftRouter = express.Router();
nftRouter.use(urlencoded({ extended: true }))
const nftImageService = new NftImageService();
const nftService = new NftService(nftImageService);

nftRouter.get("/", (req : Req, res : Res) => {
  res.send({msg: "NFT endpoint."});
});

// TODO: Might need to refactor this, 'cause this controller is taking too much responsability that maybe should be of Service layer
nftRouter.post("/create", checkToken, multer(multerConfig).single("file"), async (req : Req, res : Res) => {
   // because of `[Object: null prototype]`
  const json = JSON.parse(JSON.stringify(req.body));
  const {
    title,
    description,
    creator,
  } = json;
  
  // had to do this because usdFloorPrice comes as string
  var {
    usdFloorPrice
  } = json;
  usdFloorPrice = Number(usdFloorPrice);

  // req.file type does not contain location and key
  const { size, key, location: url } = req.file as any;
  
  if (!title || !description || !usdFloorPrice || !creator || !size || !key || !url) {
    return res.status(404).send({msg: ErrorMessages.NO_DATA});
  }
  const createdImage = await nftImageService.createNftImage({
    key,
    size,
    url
  });

  const createdNft = await nftService.createNft({
    title: title,
    description: description,
    usdFloorPrice: usdFloorPrice,
    creator: creator,
    file: createdImage.url,
  });
  
  if (!createdNft) {
    return res.status(500).send({msg: "Error while attempting to create Nft"});
  }

  return res.status(200).send({msg: 'Nft successfully created!', createdNft})

});

/**
 * be aware that user controller login method calls this url statically, like 'nft/list/'
 */
nftRouter.get('/list', checkToken, async (req : Req, res : Res) => {

  const nfts = await nftService.getAll();
  if (! nfts || nfts === null || nfts.length < 1) {
    return res.status(200).send({msg: SuccessMessages.NO_NFTS_SHOW})
  }

  res.status(200).send(nfts);

});

nftRouter.get('/:id', checkToken, async (req: Req, res: Res) => {
  const nft = await nftService.findById(req.params.id);
  if (!nft) {
    return res.status(200).send({ msg: SuccessMessages.NO_NFTS_SHOW });
  }

  res.status(200).send(nft);
});

nftRouter.post("/delete/:id", checkToken, async (req : Req, res : Res) => {
  const id = req.params.id;
  const { username } = req.body;
  console.log(id)
  console.log(username)
  if (!id) {
    return res.status(400).send({msg: ErrorMessages.NO_DATA});
  }

  const deleted = await nftService.delete(id, username);
  console.log(deleted)
  if (!deleted) {
    return res.status(404).send({msg: ErrorMessages.FAIL_DELETE});
  }

  res.status(200).send({msg: SuccessMessages.SUCC_DELETE, deleted});
});