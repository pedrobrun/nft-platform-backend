import { UserInterface, UserModel } from "../user/User";
import { hash, genSalt } from "bcrypt";
import { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NftInterface, NftModel } from "./Nft";
import { userRouter } from "../user/UserController";

export class NftService {
  // TODO: implement repository layer for decoupling
  constructor() {}

  public async createNft(nft: NftInterface) {

    const { title, description, usdFloorPrice, creator } = nft;

    const model = new NftModel({
      creator,
      description,
      title,
      usdFloorPrice
    });

    return model.save();
    
  }

  public async authUser(userData: UserInterface) {
    const existingUser = await UserModel.findOne({
      username: userData.username,
    });
    if (!existingUser) {
      return null;
    }

    const checkPassword = await bcrypt.compare(
      userData.password,
      existingUser.password
    );

    if (!checkPassword) {
      return null;
    }

    try {
      const secret: string = `${process.env.SECRET}`;
      const token = jwt.sign({ id: existingUser._id }, secret);
      return token;
    } catch (err) {
      console.log(err);
    }
  }

  public async getAll(){
    const nfts = await NftModel.find();
    return nfts;
  }

  public async delete(id: string){
    const nftToDelete = await NftModel.findById(id);

    try{
      return NftModel.deleteOne({nftToDelete});
    } catch (err) {
      console.log(err)
    }
  }

  public async findById(id: string){
    return UserModel.findById(id, '-password')
  }

  public async checkIfExists(user: UserInterface) {}
}
