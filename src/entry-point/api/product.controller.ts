import { Request, Response, NextFunction } from "express";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../../domain/product.service";

export const createProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productData = req.body;
    const product = await createProductService(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProductsService();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await getProductByIdService(productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    const updatedProduct = await updateProductService(productId, productData);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    await deleteProductService(productId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
