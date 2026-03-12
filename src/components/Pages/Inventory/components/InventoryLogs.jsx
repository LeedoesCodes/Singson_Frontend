import React, { useState, useEffect } from "react";
import { getInventoryLogs } from "../../../../api/inventory";
import {
  ArrowPathIcon,
  CubeIcon,
  ShoppingCartIcon,
  WrenchIcon,
  XCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const InventoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    total_restocks: 0,
    total_orders: 0,
    total_adjustments: 0,
    total_cancellations: 0,
  });

  // Filters
  const [productFilter, setProductFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [products, setProducts] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1);
  }, [productFilter, typeFilter, dateFrom, dateTo]);

  const fetchLogs = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        ...(productFilter && { product_id: productFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo }),
      };

      const result = await getInventoryLogs(params);

      if (result.ok) {
        setLogs(result.data.logs.data || []);
        setCurrentPage(result.data.logs.current_page);
        setLastPage(result.data.logs.last_page);
        setTotal(result.data.logs.total);
        setSummary(
          result.data.summary || {
            total_restocks: 0,
            total_orders: 0,
            total_adjustments: 0,
            total_cancellations: 0,
          },
        );
      } else {
        setError(result.data?.message || "Failed to fetch logs");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchLogs(page);
  };

  const clearFilters = () => {
    setProductFilter("");
    setTypeFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "restock":
        return <CubeIcon className="w-4 h-4" />;
      case "order":
        return <ShoppingCartIcon className="w-4 h-4" />;
      case "adjustment":
        return <WrenchIcon className="w-4 h-4" />;
      case "cancellation":
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      restock: "text-emerald-600 bg-emerald-100",
      order: "text-blue-600 bg-blue-100",
      adjustment: "text-amber-600 bg-amber-100",
      cancellation: "text-red-600 bg-red-100",
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatQuantity = (change) => {
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Logs</h1>
          <p className="text-sm text-gray-500">
            Track all stock movements and changes
          </p>
        </div>
        <button
          onClick={() => fetchLogs()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center gap-3">
          <CubeIcon className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="text-xs text-gray-500">Restocks</p>
            <p className="text-xl font-bold text-gray-800">
              {summary.total_restocks}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center gap-3">
          <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Orders</p>
            <p className="text-xl font-bold text-gray-800">
              {summary.total_orders}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-amber-500 flex items-center gap-3">
          <WrenchIcon className="w-6 h-6 text-amber-600" />
          <div>
            <p className="text-xs text-gray-500">Adjustments</p>
            <p className="text-xl font-bold text-gray-800">
              {summary.total_adjustments}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center gap-3">
          <XCircleIcon className="w-6 h-6 text-red-600" />
          <div>
            <p className="text-xs text-gray-500">Cancellations</p>
            <p className="text-xl font-bold text-gray-800">
              {summary.total_cancellations}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center gap-3">
          <ChartBarIcon className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-xs text-gray-500">Total Entries</p>
            <p className="text-xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Product
          </label>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.product_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Types</option>
            <option value="restock">Restock</option>
            <option value="order">Order</option>
            <option value="adjustment">Adjustment</option>
            <option value="cancellation">Cancellation</option>
          </select>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            To
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading inventory logs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Previous
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    New
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">
                    Change
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-gray-500">
                      No inventory logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">
                            {log.product?.product_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {log.product?.product_code}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            log.type,
                          )}`}
                        >
                          {getTypeIcon(log.type)} {log.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {log.previous_stock}
                      </td>
                      <td className="px-4 py-3 text-center">{log.new_stock}</td>
                      <td
                        className={`px-4 py-3 text-center font-medium ${
                          log.quantity_change > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatQuantity(log.quantity_change)}
                      </td>
                      <td className="px-4 py-3">
                        {log.reference_type && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {log.reference_type} #{log.reference_id}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {log.user?.name || "System"}
                      </td>
                      <td
                        className="px-4 py-3 max-w-[200px] truncate"
                        title={log.notes}
                      >
                        {log.notes || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === number
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
              >
                Next →
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            Showing page {currentPage} of {lastPage} ({total} total entries)
          </p>
        </>
      )}
    </div>
  );
};

export default InventoryLogs;
