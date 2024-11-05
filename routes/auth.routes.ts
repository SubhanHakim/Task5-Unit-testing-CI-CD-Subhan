import { Application, Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '../config/swagger.config.js';
import { signin } from '../controllers/authController';

export default (app: Application): void => {
  const router: Router = Router();

  /**
   * @swagger
   * /signin:
   *   post:
   *     summary: Login ke aplikasi
   *     description: Authenticate user and return a JWT token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: subhan
   *               password:
   *                 type: string
   *                 example: subhan321
   *     responses:
   *       200:
   *         description: Login berhasil dan mendapatkan token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Login berhasil
   *                 token:
   *                   type: string
   *                   example: your_jwt_token_here
   *       400:
   *         description: Permintaan tidak valid, nama pengguna atau kata sandi tidak ada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Username dan password diperlukan.
   *       401:
   *         description: Tidak diizinkan, username dan password salah
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Gagal login
   */

  // login
  router.post("/signin", async (req: Request, res: Response): Promise<void> => {
    try {
      await signin(req, res);
    } catch (error) {
      res.status(400).json({ 
        message: 'Login failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.use("/", router);
}; 