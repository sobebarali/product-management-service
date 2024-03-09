import Product, { IProduct } from "../data-access/product.model";
import { HttpError } from "../utils/httpError";

export const createProduct = async (productData: IProduct): Promise<IProduct> => {
  const product = new Product(productData);
  return product.save();
};

export const getProducts = async (): Promise<IProduct[]> => {
  return Product.find();
};

export const getProductById = async (productId: string): Promise<IProduct> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new HttpError(404, "Product not found");
  }
  return product;
};

export const updateProduct = async (productId: string, productData: Partial<IProduct>): Promise<IProduct> => {
  const product = await Product.findByIdAndUpdate(productId, productData, { new: true });
  if (!product) {
    throw new HttpError(404, "Product not found");
  }
  return product;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const result = await Product.findByIdAndDelete(productId);
  if (!result) {
    throw new HttpError(404, "Product not found");
  }
};