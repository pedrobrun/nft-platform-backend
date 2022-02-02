import express, {Express, Request as Req, Response as Res} from "express";
import {ErrorMessages, SuccessMessages} from "../user/Enums";
import {checkToken} from "../middlewares/jwt";
import {NftService} from "./NftService"
export const nftRouter = express.Router();

// for dependency injection, once there's a repository layer
const nftService = new NftService();

nftRouter.get("/", (req : Req, res : Res) => {
  res.send({msg: "NFT endpoint."});
});

/**
 * @param is 
 */
nftRouter.post("/create", checkToken, async (req : Req, res : Res) => {
  const {
    title,
    usdFloorPrice,
    description,
    creator,
    image
  } = req.body;

  if (!title || !description || !usdFloorPrice || !creator || !image) {
    res.status(404).send({msg: "Required data was not given to register."});
    return;
  }

  const createdNft = await nftService.createNft({
    title,
    description,
    usdFloorPrice,
    creator,
    image
  });

  if (! createdNft) {
    res.status(500).send({msg: "Error while attempting to create Nft"});
  }

  res.status(200).send({msg: 'Nft successfully created!'})


});

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
nftRouter.post("/delete", checkToken, async (req : Req, res : Res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(404).send({msg: ErrorMessages.NO_DATA});
  }

  const token = await nftService.delete(id);

  if (token == null) {
    return res.status(404).send({msg: ErrorMessages.AUTH_FAIL});
  }

  res.status(200).send({msg: SuccessMessages.AUTH_SUCC, token});
});
