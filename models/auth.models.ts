import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface untuk User Document
 */
export interface IUser extends Document {
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  toJSON(): any;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object  
 *      required:
 *        - name
 *        - password
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true 
  }
);

userSchema.method('toJSON', function(this: IUser) {
  const { __v, _id, password, ...object } = this.toObject();
  return {
    ...object,
    id: _id
  };
});

export const User = mongoose.model<IUser>('User', userSchema);
