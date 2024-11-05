import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface untuk Book Document
 */
export interface IBook extends Document {
  title: string;
  description: string;
  author: string;
  year: number;
  toJSON(): any;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object  
 *      required:
 *        - title
 *        - description
 *        - author
 *        - year
 */
const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

bookSchema.method('toJSON', function(this: IBook) {
  const { __v, _id, ...object } = this.toObject();
  return {
    ...object,
    id: _id
  };
});

export const Book = mongoose.model<IBook>('Book', bookSchema);
