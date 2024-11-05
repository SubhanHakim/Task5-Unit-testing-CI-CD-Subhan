import { Request, Response } from 'express';
import { signin } from '../../controllers/authController';
import { User, IUser } from '../../models/auth.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/auth.models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: 'testuser',
        password: 'password123'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      header: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('should return 400 if name or password is missing', async () => {
      mockRequest.body = { name: '', password: '' };

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Name dan password harus diisi!'
      });
    });

    it('should return 401 if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'user not found!'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser: Partial<IUser> = {
        name: 'testuser',
        password: 'hashedpassword'
      };

      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid Password!'
      });
    });

    it('should return success response if credentials are correct', async () => {
      const mockUser: Partial<IUser> = {
        name: 'testuser',
        password: 'hashedpassword'
      };
      const mockToken = 'mocktoken123';

      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValueOnce(mockToken);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          maxAge: 3600000,
          sameSite: 'strict'
        })
      );

      expect(mockResponse.header).toHaveBeenCalledWith(
        'Authorization',
        `Bearer ${mockToken}`
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login Success!'
      });
    });

    it('should handle errors properly', async () => {
      const error = new Error('Database error');
      (User.findOne as jest.Mock).mockRejectedValueOnce(error);

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login error',
        error: 'Database error'
      });
    });
  });
});