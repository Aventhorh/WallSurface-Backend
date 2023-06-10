import supertest from "supertest";
import { createServer } from "../index.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const app = createServer();

describe("Post", () => {
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("getAll", () => {
    it("should return all posts", async () => {
      await supertest(app).get("/posts").expect(200);
    });
  });

  describe("getOne", () => {
    it("should return one post", async () => {
      const { body, statusCode } = await supertest(app).get(
        `/posts/6347ce0bd159514a7a16b09c`
      );
      expect(statusCode).toBe(200);
    });
  });

  describe("getLastTags", () => {
    it("should return last tags", async () => {
      const { body, statusCode } = await supertest(app).get("/tags");
      expect(statusCode).toBe(200);
    });
  });

  describe("createPost", () => {
    it("should create post", async () => {
      const user = await UserModel.findOne({ email: "testewf@twwdest.ru" });
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret",
        {
          expiresIn: "30d",
        }
      );
      const { body, statusCode } = await supertest(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "teste",
          text: `${Date.now()}`,
          tags: "tet,efe,fefe,fefef",
        });
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        title: expect.any(String),
        text: expect.any(String),
        tags: expect.any(Array),
        viewsCount: expect.any(Number),
        user: expect.any(String),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      });
    });
  });
});
