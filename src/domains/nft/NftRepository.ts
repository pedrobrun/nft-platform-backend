import mongoose from "mongoose";
import { NftInterface, NftModel } from "./Nft";

export class NftRepository {
  private nftModel;
  constructor(nftModel: typeof NftModel){
    this.nftModel = nftModel;
  }

  async insert(nft: NftInterface) {
    const {
      title,
      creator,
      description,
      usdFloorPrice,
      file
    } = nft;
    
    const model = new NftModel({
      title,
      creator,
      description,
      usdFloorPrice,
      file
    });

    return model.save();
  }
}