import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation/validations.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import { PostController, UserController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://aventhor:a3521432@cluster0.jbqc44n.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DataBase ! OK !"))
  .catch((err) => console.log("DataBase ERROR!!!", err));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("");
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/auth/getAll", UserController.getAll);

app.post(
  "/upload",
  checkAuth,
  multer({ storage }).single("image"),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  }
);

app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log("LocalServer ERROR!!!", err);
  }
  console.log("LocalServer ! OK !");
});
