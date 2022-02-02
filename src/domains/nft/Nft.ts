import {model, Schema} from 'mongoose';

export interface NftInterface {
  title: string,
  usdFloorPrice: number,
  description: string,
  creator: string,
  image: {
    data: Buffer,
    contentType: string
  }
}

const UserSchema = new Schema<NftInterface>({
  title: {
    type: String,
    required: true
  },
  usdFloorPrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String
  }
}, {timestamps: true});

export const NftModel = model('Nft', UserSchema)
