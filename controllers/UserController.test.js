import supertest from "supertest";
import { createServer } from "../index.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserController } from "../controllers/index.js";

const app = createServer();

describe("User", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      await supertest(app).get("/auth/getAll").expect(200);
    });
  });

  describe("getOne", () => {
    it("should return me", async () => {
      const { body, statusCode } = await supertest(app).get("/auth/me");
      expect(statusCode).toBe(200);
    });
  });

  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("should return the user payload", async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const email = `${Date.now()}@twwdes323t.ru`;
        const name = `${Date.now()}3`;
        const password = "123";

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const userPayload = {
          _id: userId,
          email: email,
          fullName: name,
          passwordHash: hash,
        };

        const userInput = {
          email: email,
          fullName: name,
          password: password,
        };

        const createUserServiceMock = jest
          .spyOn(UserController, "register")
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/auth/register")
          .send(userInput);

        expect(statusCode).toBe(400);

        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
  });
});
