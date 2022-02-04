import express, {Express, Request as Req, Response as Res} from "express";
import {ErrorMessages, SuccessMessages} from "../user/Enums";
import {checkToken} from "../middlewares/jwt";
import {NftService} from "./NftService"
import { NftImageService } from "../nft_image/NftImageService";
import multer from "multer";
import { multerConfig } from "../nft_image/multer";
import { urlencoded } from "body-parser";
export const nftRouter = express.Router();
nftRouter.use(urlencoded({ extended: true }))
const nftImageService = new NftImageService();
const nftService = new NftService(nftImageService);

nftRouter.get("/", (req : Req, res : Res) => {
  res.send({msg: "NFT endpoint."});
});

/**
 * @param is 
 */
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

  const { size, key, location: url } = req.file;
  
  if (!title || !description || !usdFloorPrice || !creator || !size || !key || !url) {
    res.status(404).send({msg: "Required data was not given to register."});
    return;
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
    res.status(500).send({msg: "Error while attempting to create Nft"});
  }

  res.status(200).send({msg: 'Nft successfully created!', createdNft})

});

/**
 * be aware that user controller login method calls this url statically, like 'nft/list/'
 */
nftRouter.get('/list', checkToken, async (req : Req, res : Res) => {

  const nfts = await nftService.getAll();

  if (! nfts || nfts === null || nfts.length < 1) {
    return res.status(200).send({msg: 'There are no NFTs to show.'})
  }

  res.status(200).send(nfts);

});

/**
 * @param is 
 */
nftRouter.post("/delete/:id", checkToken, async (req : Req, res : Res) => {
  const id = req.params.id;
  const { username } = req.body;

  if (!id) {
    return res.status(404).send({msg: ErrorMessages.NO_DATA});
  }

  const deleted = await nftService.delete(id, username);

  if (!deleted) {
    return res.status(404).send({msg: 'Not able to delete.'});
  }

  res.status(200).send({msg: 'Successfully deleted', deleted});
});