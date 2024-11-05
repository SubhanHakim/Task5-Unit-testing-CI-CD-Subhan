import { Request, Response } from "express";
import {
  createBook,
  getAllBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../../controllers/book.controller";
import { Book } from "../../models/book.models";

jest.mock("../../models/book.models");
describe("Book Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {
        title: "Test Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      },
      params: {
        id: "book123",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createBook", () => {
    it("should create a new book", async () => {
      const mockBook = {
        ...mockRequest.body,
        id: "book123",
        save: jest.fn().mockResolvedValue(true),
      };

      (Book.findOne as jest.Mock).mockResolvedValue(null);
      (Book as any).mockImplementation(() => mockBook);

      await createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockBook,
      });
    });

    it("should return 400 if the book already exists", async () => {
      (Book.findOne as jest.Mock).mockResolvedValue({});
      await createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book already exists",
      });
    });
  });

  describe("getAllBook", () => {
    it("should return all books", async () => {
      const mockBooks = [new Book({ ...mockRequest.body, id: "book123" })];
      (Book.find as jest.Mock).mockResolvedValue(mockBooks);

      await getAllBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });
  });

  describe("getBookById", () => {
    it("should return a book by id", async () => {
      const mockRequest = {
        params: {
          id: "book123",
        },
      } as Request<{ id: string }>;

      const mockBook = new Book({ ...mockRequest.body, id: "book123" });
      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      await getBookById(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });
  });

  describe("updateBook", () => {
    it("should update a book by id", async () => {
      const mockRequest = {
        params: { id: "book123" },
        body: {
          title: "Updated Book",
          author: "Updated Author",
        },
      } as Request<{ id: string }>;
      const updatedBook = new Book({ ...mockRequest.body, _id: "book123" });
      (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedBook);

      await updateBook(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: updatedBook,
      });
    });
    it("should return 404 if book not found", async () => {
      const mockRequest = {
        params: { id: "nonexistentId" },
        body: {
          title: "Updated Book",
          author: "Updated Author",
        },
      } as Request<{ id: string }>;

      (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateBook(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "error",
        message: "Book not found",
      });
    });
  });

  describe("deleteBook", () => {
    it("should delete a book by id", async () => {
      const mockRequest = {
        params: { id: "book123" },
      } as Request<{ id: string }>;
      const deletedBook = new Book({ _id: "book123", title: "Test Book" });

      (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedBook);

      await deleteBook(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book deleted successfully",
        data: deletedBook,
      });
    });
    it("should return 404 if book not found", async () => {
      const mockRequest = {
        params: { id: "book123" },
      } as Request<{ id: string }>;
      (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteBook(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book not found",
      });
    });
  });
});
