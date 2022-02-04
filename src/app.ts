// lib/dependencies imports
import dotenv from "dotenv";
import express, {Express, Request as Req, Response as Res} from "express";
import mongoose from "mongoose";
const path = require('path');
import {GridFsStorage} from 'multer-gridfs-storage';
const crypto = require('crypto');
import cors from 'cors';

// file imports
import {indexRouter} from "./index";
import {userRouter} from "./domains/user/UserController";
import {nftRouter} from "./domains/nft/NftController";
import {nftImageRouter} from "./domains/nft_image/NftImageController"

const app: Express = express();
dotenv.config();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


// env
const dbUri = process.env.MONGO_URI;
const dbPort = process.env.DB_PORT;

const storage = new GridFsStorage({
  url: `${
    process.env.MONGO_URI
  }`,
  file: (req : any, file : any) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err : any, buf : any) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

// routes
app.use("/", indexRouter);
app.use("/user", userRouter);

/**
 * be aware that user controller login method calls this url statically, like 'nft/list/'
 */
app.use("/nft", nftRouter)

app.use("/nft-image", nftImageRouter);

mongoose.connect(`${dbUri}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},).then(() => {
  app.listen(3000);
  console.log("Connected to database");
}).catch((err) => console.log(err));
