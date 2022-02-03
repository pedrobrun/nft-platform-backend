import { UserInterface, UserModel } from "../user/User";
import { hash, genSalt } from "bcrypt";
import { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NftInterface, NftModel } from "./Nft";
import { userRouter } from "../user/UserController";
import { NftImageService } from "../nft_image/NftImageService";
import { NftImageInterface } from "../nft_image/NftImage";

/**
 * TODO: implement Repository layer for more decoupling and dependency injection
 */
export class NftService {
  private nftImageService: NftImageService;
  
  constructor(nftImageService: NftImageService) {
    this.nftImageService = nftImageService;
  }

  public async createNft(nft: NftInterface) {

    const { title, description, usdFloorPrice, creator, file } = nft;

    const model = new NftModel({
      title,
      creator,
      description,
      usdFloorPrice,
      file
    });

    return model.save();
    
  }

  public async getAll(){
    return NftModel.find();
  }

  public async delete(id: string){
    return NftModel.findOneAndDelete(id);
  }

  public async findById(id: string){
    return UserModel.findById(id, '-password')
  }

}
