import {model, Schema} from 'mongoose';

export interface UserInterface {
  username: string,
  password: string
}

const UserSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: true});

export const UserModel = model('User', UserSchema)
