import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app";
import Product from "../src/data-access/product.model";

describe("Product Management Service", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe("Create Product", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "Test Product",
        description: "This is a test product",
        price: 9.99,
        quantity: 10,
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.quantity).toBe(productData.quantity);
    });

    it("should return a validation error for missing fields", async () => {
      const productData = {
        name: "Test Product",
        price: 9.99,
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Validation error");
    });
  });

  describe("Get Products", () => {
    it("should return a list of products", async () => {
      const product1 = new Product({
        name: "Product 1",
        description: "This is product 1",
        price: 9.99,
        quantity: 10,
      });
      const product2 = new Product({
        name: "Product 2",
        description: "This is product 2",
        price: 19.99,
        quantity: 5,
      });
      await product1.save();
      await product2.save();

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe(product1.name);
      expect(response.body[1].name).toBe(product2.name);
    });
  });

  describe("Get Product by ID", () => {
    it("should return a product by ID", async () => {
      const product = new Product({
        name: "Test Product",
        description: "This is a test product",
        price: 9.99,
        quantity: 10,
      });
      await product.save();

      const response = await request(app).get(`/api/products/${product._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(product.name);
      expect(response.body.description).toBe(product.description);
      expect(response.body.price).toBe(product.price);
      expect(response.body.quantity).toBe(product.quantity);
    });

    it("should return a 404 error for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/products/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });
  });

  describe("Update Product", () => {
    it("should update a product", async () => {
      const product = new Product({
        name: "Test Product",
        description: "This is a test product",
        price: 9.99,
        quantity: 10,
      });
      await product.save();

      const updatedProductData = {
        name: "Updated Product",
        description: "This is an updated product",
        price: 19.99,
        quantity: 5,
        version: product.version,
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedProductData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedProductData.name);
      expect(response.body.description).toBe(updatedProductData.description);
      expect(response.body.price).toBe(updatedProductData.price);
      expect(response.body.quantity).toBe(updatedProductData.quantity);
    });

    it("should return a 404 error for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedProductData = {
        name: "Updated Product",
        version: 1,
      };

      const response = await request(app)
        .put(`/api/products/${nonExistentId}`)
        .send(updatedProductData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return a 409 error for version mismatch", async () => {
      const product = new Product({
        name: "Test Product",
        description: "This is a test product",
        price: 9.99,
        quantity: 10,
      });
      await product.save();

      const updatedProductData = {
        name: "Updated Product",
        version: product.version + 1,
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedProductData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Product version mismatch. Expected version: 0, provided version: 1. Please refresh and try again."
      );
    });
  });

  describe("Delete Product", () => {
    it("should delete a product", async () => {
      const product = new Product({
        name: "Test Product",
        description: "This is a test product",
        price: 9.99,
        quantity: 10,
      });
      await product.save();

      const response = await request(app).delete(
        `/api/products/${product._id}`
      );

      expect(response.status).toBe(204);

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    it("should return a 404 error for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(
        `/api/products/${nonExistentId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });
  });
});
