import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Book, IBook } from "../models/book.models";

interface BookRequest {
  title: string;
  description: string;
  author: string;
  year: number;
}

// create book
export const createBook = async (
  req: AuthRequest & Request<{}, {}, BookRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, author, year } = req.body;

    // check apabila book sudah ready
    const existingBook: IBook | null = await Book.findOne({ title });
    if (existingBook) {
      res.status(400).json({ message: "Book already exists" });
      return;
    }

    // create book
    const newBook: IBook = new Book({ title, description, author, year });
    await newBook.save();
    res.status(201).json({
      status: "success",
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

// get all book
export const getAllBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const books: IBook[] = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// get book by id
export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const book: IBook | null = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// update Book
export const updateBook = async (
  req: AuthRequest & Request<{ id: string }, {}, BookRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, author, year } = req.body;

    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        author,
        year,
      },
      { new: true }
    );

    if (!updatedBook) {
      res.status(404).json({ status: "error", message: "Book not found" });
      return;
    }

    res.status(200).json({
      status: "success",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// delete book
export const deleteBook = async (
  req: AuthRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookId: string = req.params.id;

    const deletedBook: IBook | null = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
      data:deletedBook,
    });
  } catch (error) {
    next(error);
  }
};
