import React, { useEffect, useState } from "react";
import { getProducts } from "../../../api/product";
import "./Products.scss";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getStockClass = (count) => {
    if (count > 10) return "high";
    if (count > 0) return "low";
    return "out";
  };

  const getStockLabel = (count) => {
    if (count > 10) return "In Stock";
    if (count > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getStockNote = (count) => {
    if (count > 10) return "Stock level is healthy.";
    if (count > 0) return "Warning: stock is running low.";
    return "Critical: item is out of stock.";
  };

  const totalProducts = products.length;
  const inStockCount = products.filter(
    (product) => product.current_stock > 10,
  ).length;
  const lowStockCount = products.filter(
    (product) => product.current_stock > 0 && product.current_stock <= 10,
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.current_stock === 0,
  ).length;

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h2>Products Management</h2>
          <p className="products-subtitle">
            Monitor product stock levels and identify low-stock items quickly.
          </p>
        </div>
      </div>

      {loading && <p className="products-message">Loading products...</p>}

      {error && <p className="error-message">Error: {error}</p>}

      {!loading && !error && products.length > 0 && (
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Products</span>
            <span className="summary-value">{totalProducts}</span>
          </div>

          <div className="summary-card success">
            <span className="summary-label">In Stock</span>
            <span className="summary-value">{inStockCount}</span>
          </div>

          <div className="summary-card warning">
            <span className="summary-label">Low Stock</span>
            <span className="summary-value">{lowStockCount}</span>
          </div>

          <div className="summary-card danger">
            <span className="summary-label">Out of Stock</span>
            <span className="summary-value">{outOfStockCount}</span>
          </div>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="products-message">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Price</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Inventory Note</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="product-code">{product.product_code}</td>
                  <td className="product-name">{product.product_name}</td>
                  <td className="product-price">
                    ₱{Number(product.price).toFixed(2)}
                  </td>
                  <td>{product.current_stock} units</td>
                  <td>
                    <span
                      className={`stock-badge ${getStockClass(product.current_stock)}`}
                    >
                      {getStockLabel(product.current_stock)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`stock-note ${getStockClass(product.current_stock)}`}
                    >
                      {getStockNote(product.current_stock)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
