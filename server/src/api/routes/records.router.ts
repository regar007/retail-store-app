import express from "express";
import controller from "../controllers/pricing-feed-controller";
import multer from "multer";

const upload = multer({ dest: "./public" });

export default express
  .Router()
  .post("/records", controller.getRecords)
  .post("/", upload.single("file"), controller.create)
  .put("/", controller.update)
  .get("/", controller.search);
