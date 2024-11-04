import React, { useState, useEffect } from "react";

const ProductManagement = ({ products, setProducts }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [editProductIndex, setEditProductIndex] = useState(null);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, [setProducts]);

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const product = {
      name: productName,
      description: productDescription,
      category: productCategory,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity, 10),
    };

    const updatedProducts =
      editProductIndex === null
        ? [...products, product]
        : products.map((prod, index) =>
            index === editProductIndex ? product : prod
          );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Reset the form
    setEditProductIndex(null);
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setProductPrice("");
    setProductQuantity("");
  };

  const editProduct = (index) => {
    const product = products[index];
    setProductName(product.name);
    setProductDescription(product.description);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductQuantity(product.quantity);
    setEditProductIndex(index);
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <section id="productManagement">
      <h2>Manage Products</h2>
      <form onSubmit={handleProductSubmit}>
        <input
          type="text"
          value={productName}
          placeholder="Product Name"
          required
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          value={productDescription}
          placeholder="Description"
          required
          onChange={(e) => setProductDescription(e.target.value)}
        />
        <select
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Choose category
          </option>
          <option value="Hot Beverage">Hot Beverage</option>
          <option value="Cold Beverage">Cold Beverage</option>
          <option value="Baked">Baked</option>
          <option value="Fried Food">Fried Food</option>
          <option value="Junk">Junk</option>
          <option value="Snacks">Snacks</option>
        </select>
        <input
          type="number"
          value={productPrice}
          placeholder="Price"
          required
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
          type="number"
          value={productQuantity}
          placeholder="Quantity"
          required
          onChange={(e) => setProductQuantity(e.target.value)}
        />
        <button type="submit">
          {editProductIndex === null ? "Add Product" : "Update Product"}
        </button>
      </form>

      <h3>Existing Products</h3>
      <table id="productTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => editProduct(index)}>Edit</button>
                <button onClick={() => deleteProduct(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ProductManagement;
