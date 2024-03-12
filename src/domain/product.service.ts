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
  try {
    const product = await getProductById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found.");
    }

    // Check if the version is provided and is a valid number
    if (
      productData.version === undefined ||
      isNaN(productData.version) ||
      productData.version < 0
    ) {
      throw new HttpError(400, "Invalid product version.");
    }

    // Check if the version matches
    if (productData.version !== product.version) {
      throw new HttpError(
        409,
        `Product version mismatch. Expected version: ${product.version}, provided version: ${productData.version}. Please refresh and try again.`
      );
    }

    // Increment the version before updating
    const updatedProductData: Partial<IProduct> = {
      ...productData,
      version: product.version + 1,
    };

    const updatedProduct = await updateProduct(productId, updatedProductData);
    return updatedProduct;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "An error occurred while updating the product.");
  }
};

export const deleteProductService = async (
  productId: string
): Promise<void> => {
  await deleteProduct(productId);
};
