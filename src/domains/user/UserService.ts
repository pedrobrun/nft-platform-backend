import { UserInterface, UserModel } from "./User";
import { hash, genSalt } from "bcrypt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  // TODO: implement repository layer for decoupling
  constructor() {}

  public async registerUser(user: UserInterface) {

    const salt = await genSalt(12);
    user.password = await hash(user.password, salt);

    const model = new UserModel({
      username: user.username,
      password: user.password,
    });

    return model.save();
  }

  public async authUser(userData: UserInterface) {
    const existingUser = await UserModel.findOne({
      username: userData.username,
    });
    if (!existingUser) {
      return null;
    }

    const checkPassword = await bcrypt.compare(
      userData.password,
      existingUser.password
    );

    if (!checkPassword) {
      return null;
    }
    
    try {
      const secret: string = `${process.env.SECRET}`;
      const token = jwt.sign({ id: existingUser._id }, secret);

      const authenticatedPayload = ({
        token: token,
        username: existingUser.username
      });
      return authenticatedPayload;
      
    } catch (err) {
      console.log(err);
    }
  }

  public async findById(id: string){
    return await UserModel.findById(id, '-password')
  }

  public async checkUsernameExists(username: string) {
    return await UserModel.findOne({username: username});
  }
}
