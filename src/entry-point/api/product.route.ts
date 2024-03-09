import express from "express";
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler,
} from "./product.controller";
import { validateRequest } from "../../middlewares/validation.middleware"
import { createProductSchema, updateProductSchema } from "./product.validator";

const router = express.Router();

router.post("/", validateRequest(createProductSchema), createProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", getProductByIdHandler);
router.put("/:id", validateRequest(updateProductSchema), updateProductHandler);
router.delete("/:id", deleteProductHandler);

export default router;
