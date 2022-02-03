import {model, Schema} from 'mongoose';
import aws from 'aws-sdk';

const s3 = new aws.S3();

export interface NftImageInterface {
  size: number,
  key: string,
  url: string,
}

const NftImageSchema = new Schema<NftImageInterface>({
  size: { type: Number },
  key: { type: String },
  url: { type: String},
}, {timestamps: true});

NftImageSchema.pre('remove', function() {
  s3.deleteObject({
    Bucket: process.env.BUCKET_NAME,
    Key: this.key,
  }).promise().catch((e) => console.log(e.message));
})

export const NftImageModel = model('NftImage', NftImageSchema)
