import mongoose, { set } from "mongoose";
import app from "../../app";
import { Book } from "../../models/book.models";
import { setupTestDB } from "../setup";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import { title } from "process";

const request = supertest(app);

describe("Book Routes Integration Test", () => {
  setupTestDB();

  let authToken: string;
  let testBookId: string = "";

  beforeAll(() => {
    authToken = jwt.sign({ id: "123" }, process.env.JWT_SECRET as string);
  });

  beforeEach(async () => {
    await Book.deleteMany({});
  });

  describe("GET /books", () => {
    it("should return empty array when no books exist", async () => {
      const response = await request.get("/books").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all books", async () => {
      const testBook = await Book.create({
        title: "Test Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      const response = await request.get("/books").expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe("GET /books/:id", () => {
    it("should return a book by id", async () => {
      const testBook = await Book.create({
        title: "Test Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      const response = await request.get(`/books/${testBook._id}`).expect(200);

      expect(response.body.title).toBe(testBook.title);
    });

    it("should return 404 if book not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request.get(`/books/${fakeId}`).expect(404);
    });
  });

  describe("POST /create", () => {
    it("should create a new book when authorized", async () => {
      const newBook = {
        title: "New Book",
        description: "New Description",
        author: "New Author",
        year: 2024,
      };
      const response = await request
        .post("/create")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Content-Type", "application/json")
        .send(newBook)
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.title).toBe(newBook.title);

      //   verify book in database
      const bookInDb = await Book.findOne({ title: newBook.title });
      expect(bookInDb).toBeTruthy();
      expect(bookInDb?.title).toBe(newBook.title);
    });

    it("should return 403 when not authorized", async () => {
      const newBook = {
        title: "New Book",
        description: "New Description",
        author: "New Author",
        year: 2024,
      };
      await request.post("/create").send(newBook).expect(403);
    });

    it("should return 400 if book already exists", async () => {
      const existingBook = {
        title: "Existing Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      };

      await request
        .post("/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(existingBook);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request
        .post("/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(existingBook)
        .expect(400);

      expect(response.body).toEqual({
        message: "Book already exists",
      });

      const booksCount = await Book.countDocuments({
        title: existingBook.title,
      });
      expect(booksCount).toBe(1);
    });
  });

  describe("PUT /books/:id", () => {
    it("should update a book by id", async () => {
      const testBook = await Book.create({
        title: "updated book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      const updateData = {
        title: "updated book",
        description: "Test Description",
        author: "Test Author",
        year: 2025,
      };

      const response = await request
        .put(`/books/${testBook._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      console.log(response.body);

      // Verifikasi response
      expect(response.body.status).toBe("success");
      expect(response.body.data).toEqual(
        expect.objectContaining({
          title: updateData.title,
          description: updateData.description,
          author: updateData.author,
          year: updateData.year,
        })
      );

      // Verifikasi di database
      const updatedBook = await Book.findById(testBook._id);
      expect(updatedBook).toBeTruthy();
    });

    it("should return 403 when not authorized", async () => {
      const bookId = new mongoose.Types.ObjectId();
      await request
        .put(`/books/${bookId}`)
        .send({ title: "updated book" })
        .expect(403);
    });

    it("should return 404 if book not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request
        .put(`/books/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "updated book" })
        .expect(404);
    });

    // Test case untuk partial update
    it("should handle partial updates successfully", async () => {
      const book = await Book.create({
        title: "Test Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      const partialUpdate = {
        title: "Updated Title Only",
      };

      const response = await request
        .put(`/books/${book._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(partialUpdate)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.title).toBe(partialUpdate.title);
      // Other fields should remain unchanged
      expect(response.body.data.description).toBe(book.description);
      expect(response.body.data.author).toBe(book.author);
      expect(response.body.data.year).toBe(book.year);
    });
  });

  describe("DELETE /books/:id", () => {
    it("should delete book with valid token", async () => {
      // Buat buku baru untuk dihapus
      const bookToDelete = await Book.create({
        title: "Book To Delete",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      await request
        .delete(`/books/${bookToDelete._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verifikasi buku sudah terhapus
      const deletedBook = await Book.findById(bookToDelete._id);
      expect(deletedBook).toBeNull();
    });

    it("should return 403 without token", async () => {
      // Buat buku baru
      const book = await Book.create({
        title: "Test Book",
        description: "Test Description",
        author: "Test Author",
        year: 2024,
      });

      await request.delete(`/books/${book._id}`).expect(403);

      // Verifikasi buku masih ada
      const existingBook = await Book.findById(book._id);
      expect(existingBook).toBeTruthy();
    });

    it("should return 404 if book not found", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await request
        .delete(`/books/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
