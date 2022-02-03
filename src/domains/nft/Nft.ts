import {model, Schema} from 'mongoose';
import { nftImageRouter } from '../nft_image/NftImageController';

export interface NftInterface {
  title: string,
  usdFloorPrice: number,
  description: string,
  creator: string,
  file: string
}

const NftSchema = new Schema<NftInterface>({
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
  file: {
    type: String,
    required: true,
  }
}, {timestamps: true});


export const NftModel = model('Nft', NftSchema)
