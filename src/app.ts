// lib/dependencies imports
import dotenv from "dotenv";
import express, {Express, Request as Req, Response as Res} from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const path = require('path');
const multer = require('multer');
import {GridFsStorage} from 'multer-gridfs-storage';
const crypto = require('crypto');

// file imports
import {indexRouter} from "./index";
import {userRouter} from "./domains/user/UserController";
import {nftRouter} from "./domains/nft/NftController";
import {imgRouter} from "./domains/nft_image/NftImageController"

const app: Express = express();
dotenv.config();

app.use(express.urlencoded({extended: true}));
app.use(express.json());


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

export const upload = multer({storage});

// routes
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/nft", nftRouter)
app.use("/nft-image", imgRouter(upload));

mongoose.connect(`${dbUri}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},).then(() => {
  app.listen(dbPort);
  console.log("Connected to database");
}).catch((err) => console.log(err));
