import { UserModel } from "../user/User";
import { NftInterface, NftModel } from "./Nft";
import { NftImageService } from "../nft_image/NftImageService";
import mongoose from "mongoose";

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

  // TODO (URGENT): DECOUPLE THIS 
  // I had to do this extremely coupled spaghetti code because I couldn't use
  // model interface for the methods that search in DB.

  public async getAll(){
    return NftModel.find();
  }

  public async delete(id: string, username: string){
    if (mongoose.Types.ObjectId.isValid(id)){
      const nftToDelete = await NftModel.findOne({ _id: id, creator: username });
      if(nftToDelete){
        return NftModel.deleteOne(nftToDelete)
      }
    }
    return null;
  }

  public async findById(id: string){
    return NftModel.findById(id)
  }

}
