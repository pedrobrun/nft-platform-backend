import { NftImageInterface, NftImageModel } from "./NftImage";

export class NftImageService {
  // TODO: implement repository layer for decoupling
  constructor() {}

  public async createNftImage(nft: NftImageInterface) {

    const { key, size, url } = nft;

    const model = new NftImageModel({
      key,
      size,
      url,
    });
    return model.save();
  }

  public async getAll() {
    return NftImageModel.find();
  }

}
