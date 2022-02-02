import express, {Request as Req, Response as Res} from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', (req: Req, res: Res) => {
  res.send({ msg: 'Welcome to our NFT platform!' })
});