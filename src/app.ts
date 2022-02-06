/**
 * 
 * I'm fully aware that these imports are looking messy:
 * This was me trying to fix some Heroku build errors
 * 
 */

import dotenv from "dotenv";
import express, {Express, Request as Req, Response as Res} from "express";
import mongoose from "mongoose";
const path = require('path');
import {GridFsStorage} from 'multer-gridfs-storage';
const crypto = require('crypto');
const cors = require('cors');

import {indexRouter} from "./index";
import {userRouter} from "./domains/user/UserController";
import {nftRouter} from "./domains/nft/NftController";
import {nftImageRouter} from "./domains/nft_image/NftImageController"

const app: Express = express();
dotenv.config();

const dbUri = process.env.MONGO_URI;

const port = process.env.PORT || 3000;


mongoose.connect(`${dbUri}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},).then(() => {
  app.listen(port);
  console.log("Connected to database");
}).catch((err) => console.log(err));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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