/**
 * Optimized Admin Dashboard Order Management
 * Uses pagination and performance optimizations for better scalability
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useApiService from '../hooks/useApiService';
import Pagination from '../components/ui/Pagination';
import { QueryOptimizer } from '../utils/performanceOptimization';

const AdminOrdersManager = ({ userClinic, currentusertoken }) => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
    clinic: userClinic === 'Admin' ? 'ambher' : (userClinic === 'Ambher Optical' ? 'ambher' : 'bautista')
  });

  const { fetchAllAmbherOrders, fetchAllBautistaOrders } = useApiService();

  // Debounced search
  const debouncedSearch = useMemo(
    () => QueryOptimizer.debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, 500),
    []
  );

  // Fetch orders function
  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const fetchFunction = filters.clinic === 'ambher' ? fetchAllAmbherOrders : fetchAllBautistaOrders;
      
      const response = await fetchFunction(
        page,
        pagination.itemsPerPage,
        filters.status,
        filters.search
      );

      // Handle response
      if (Array.isArray(response)) {
        // Legacy response format
        setOrders(response);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(response.length / pagination.itemsPerPage),
          totalItems: response.length
        }));
      } else {
        // New paginated response format
        setOrders(response.orders || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters.clinic, filters.status, filters.search, pagination.itemsPerPage, fetchAllAmbherOrders, fetchAllBautistaOrders]);

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  // Status filter handler
  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clinic filter handler (for admin users)
  const handleClinicFilter = (clinic) => {
    setFilters(prev => ({ ...prev, clinic }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setOrders([]); // Clear current orders
  };

  // Page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    if (currentusertoken) {
      fetchOrders(1);
    }
  }, [filters.clinic, filters.status, currentusertoken, fetchOrders]);

  // Status options
  const statusOptions = ['All', 'Pending', 'Ready for Pickup', 'Completed'];

  // Get status counts (for display purposes)
  const getStatusCount = (status) => {
    if (status === 'All') return orders.length;
    const statusField = filters.clinic === 'ambher' ? 'patientorderambherstatus' : 'patientorderbautistastatus';
    return orders.filter(order => order[statusField] === status).length;
  };

  // Format status for display
  const formatStatus = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Ready for Pickup': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Render order row
  const renderOrderRow = (order, index) => {
    const isAmbher = filters.clinic === 'ambher';
    const idField = isAmbher ? 'patientorderambherid' : 'patientorderbautistaid';
    const statusField = isAmbher ? 'patientorderambherstatus' : 'patientorderbautistastatus';
    const productNameField = isAmbher ? 'patientorderambherproductname' : 'patientorderbautistaproductname';
    const priceField = isAmbher ? 'patientorderambherproductprice' : 'patientorderbautistaproductprice';
    const pickupDateField = isAmbher ? 'patientorderambherproductchosenpickupdate' : 'patientorderbautistaproductchosenpickupdate';

    return (
      <tr key={order[idField]} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{order[idField]}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {order.patientfirstname} {order.patientlastname}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
          {order[productNameField]}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ₱{order[priceField]?.toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${formatStatus(order[statusField])}`}>
            {order[statusField]}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(order[pickupDateField]).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </td>
      </tr>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error Loading Orders</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button 
          onClick={() => fetchOrders(pagination.currentPage)}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Orders Management - {filters.clinic === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center'}
        </h2>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Clinic Selector (Admin only) */}
          {userClinic === 'Admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleClinicFilter('ambher')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.clinic === 'ambher'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ambher Optical
              </button>
              <button
                onClick={() => handleClinicFilter('bautista')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.clinic === 'bautista'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bautista Eye Center
              </button>
            </div>
          )}

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>

        {/* Performance Info */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {pagination.itemsPerPage} orders per page • Page {pagination.currentPage} of {pagination.totalPages}
          {loading && (
            <span className="ml-2 inline-flex items-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-1"></div>
              Loading...
            </span>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    {[...Array(7)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                    <p>
                      {filters.status !== 'All' || filters.search 
                        ? 'Try adjusting your filters or search terms.'
                        : 'No orders have been placed yet.'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => renderOrderRow(order, index))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersManager;
