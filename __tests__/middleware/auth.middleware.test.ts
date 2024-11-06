import { Response, NextFunction } from "express";
import { authMiddleware, AuthRequest } from "../../middleware/auth.middleware";
import jwt from "jsonwebtoken";
import { mock } from "node:test";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();

    // reset JWT_SECRET
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Token validation", () => {
    it("should return 403 if no token is provided", async () => {
      (mockRequest.header as jest.Mock).mockReturnValue(undefined);

      await authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 403 when Authorization header is malformed", async () => {
      (mockRequest.header as jest.Mock).mockReturnValue("InvalidTokenFormat");

      await authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("successful Authentication", () => {
    it("should set req.userId and call next when token is valid", async () => {
      const mockUserID = "user-123";
      (mockRequest.header as jest.Mock).mockReturnValue(`Bearer ${mockUserID}`);
      (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserID });

      await authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.userId).toBe(mockUserID);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
