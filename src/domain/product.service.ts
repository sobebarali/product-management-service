import { HttpError } from "../utils/httpError";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../data-access/product.repository";
import { IProduct } from "../data-access/product.model";

export const createProductService = async (
  productData: IProduct
): Promise<IProduct> => {
  return createProduct(productData);
};

export const getProductsService = async (): Promise<IProduct[]> => {
  return getProducts();
};

export const getProductByIdService = async (
  productId: string
): Promise<IProduct> => {
  return getProductById(productId);
};

export const updateProductService = async (
  productId: string,
  productData: Partial<IProduct>
): Promise<IProduct> => {
  const product = await getProductById(productId);

  // Check if the version matches
  if (productData.version !== product.version) {
    throw new HttpError(
      409,
      "Product version mismatch. Please refresh and try again."
    );
  }

  // Increment the version before updating
  productData.version = product.version + 1;

  return updateProduct(productId, productData);
};

export const deleteProductService = async (
  productId: string
): Promise<void> => {
  await deleteProduct(productId);
};
