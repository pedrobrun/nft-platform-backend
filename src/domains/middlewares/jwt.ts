import { Request as Req, Response as Res } from 'express';
import { ErrorMessages } from '../user/Enums';
import jwt from 'jsonwebtoken';

export const checkToken = (req: Req, res: Res, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) {
    return res.status(401).json({ msg: ErrorMessages.ACCESS_DENIED })
  }

  try {
    const secret = `${process.env.SECRET}`;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(404).json({ msg: ErrorMessages.INVALID_TOKEN})
  }
}