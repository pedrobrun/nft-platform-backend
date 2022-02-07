import express, {Express, Request as Req, Response as Res} from "express";
import { checkToken } from "../middlewares/jwt";
import { ErrorMessages, SuccessMessages } from "./Enums";
import {UserService} from "./UserService";
export const userRouter = express.Router();

// for dependency injection, once there's a repository layer
const userService = new UserService();

userRouter.get("/", (req : Req, res : Res) => {
  res.send({msg: "User endpoint."});
});

userRouter.post("/register", async (req : Req, res : Res) => {
  const {username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send({msg: "Required data was not given to register."});
  }

  const existing = await userService.checkUsernameExists(username)
  if (existing) {
    return res.status(400).send({msg: "Username already exists."});
  }
  console.log(existing)

  const registeredUser = await userService.registerUser({username, password});

  if (!registeredUser) {
    res.status(500).send({msg: ErrorMessages.REGISTER_FAIL});
  }

  res.status(200).send({ msg: SuccessMessages.REGISTER_SUCC })
  
});

userRouter.get("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await userService.findById(id);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
});

userRouter.post("/login", async (req : Req, res : Res) => {
  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).send({msg: ErrorMessages.NO_DATA});
  }

  const authenticated = await userService.authUser({username, password});

  if(authenticated == null) {
    return res.status(404).send({ msg: ErrorMessages.AUTH_FAIL});
  }
  res.cookie('jwt', authenticated.token);
  res.cookie('username', authenticated.username);

  res.status(200).send({msg: SuccessMessages.AUTH_SUCC, authenticated});
});

// TODO: figure out how to make a good server-side logout method
userRouter.post("/logout", checkToken, async (req: Req, res: Res) => {
  res.redirect('/');
});
