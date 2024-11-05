import {
  Application,
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerConfig from "../config/swagger.config";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createBook,
  getAllBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: number
 */

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     description: Retrieve all books from database. No authentication required.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: No books found
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by id
 *     description: Retrieve a single book by id. No authentication required.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /create:
 *   post:
 *     tags: [Books]
 *     summary: Create new book
 *     description: Create a new book. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update book
 *     description: Update an existing book. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book
 *     description: Delete a book. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */

const router: Router = Router();

router.get("/books", getAllBook);
router.get("/books/:id", getBookById);
router.post("/create", authMiddleware, createBook);
router.put("/books/:id", authMiddleware, updateBook);
router.delete("/books/:id", authMiddleware, deleteBook);

export default (app: Application): void => {
  app.use("/", router);
};
