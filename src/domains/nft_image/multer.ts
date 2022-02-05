import multer from 'multer';
import path from 'path';
import crypto from 'crypto'
import aws from 'aws-sdk'
import multerS3 from 'multer-s3';
import { Request as Req, Response as Res } from 'express';

const storageTypes: string | any = {
  local: multer.diskStorage({
    destination: (req: Req, file: Express.Multer.File, cb: any) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req: Req, file: Express.Multer.File, cb: any) => {
      crypto.randomBytes(16, (err: any, hash: any) => {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'nft-platform-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req: Req, file: Express.Multer.File, cb: any) => {
      crypto.randomBytes(16, (err: any, hash: any) => {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  })
};

export const multerConfig = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes['s3'],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req: Req, file: Express.Multer.File, cb: any) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};