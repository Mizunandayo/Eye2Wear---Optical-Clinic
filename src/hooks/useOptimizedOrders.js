/**
 * Optimized Order Management Hook
 * Handles pagination, virtual scrolling, and performance optimizations for order lists
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import useApiService from './useApiService';
import { LazyOrderLoader, QueryOptimizer } from '../utils/performanceOptimization';

const useOptimizedOrders = (patientemail) => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters and search
  const [filters, setFilters] = useState({
    status: 'All',
    search: '',
    orderType: 'ambher' // 'ambher' or 'bautista'
  });

  const { fetchAmbherOrders, fetchBautistaOrders } = useApiService();

  // Debounced search function
  const debouncedSearch = useMemo(
    () => QueryOptimizer.debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    }, 300),
    []
  );

  // Fetch orders function
  const fetchOrders = useCallback(async (page = 1) => {
    if (!patientemail) return;

    setLoading(true);
    setError(null);

    try {
      const fetchFunction = filters.orderType === 'ambher' ? fetchAmbherOrders : fetchBautistaOrders;
      
      const response = await fetchFunction(
        patientemail,
        page,
        pagination.itemsPerPage
      );

      // Handle both paginated and non-paginated responses
      if (Array.isArray(response)) {
        // Non-paginated response (legacy)
        setOrders(response);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: response.length,
          hasNextPage: false,
          hasPrevPage: false
        }));
      } else {
        // Paginated response
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
  }, [patientemail, filters.orderType, pagination.itemsPerPage, fetchAmbherOrders, fetchBautistaOrders]);

  // Load order details on demand
  const loadOrderDetails = useCallback(async (orderId) => {
    try {
      return await LazyOrderLoader.fetchOrderDetails(orderId, filters.orderType);
    } catch (err) {
      console.error('Error loading order details:', err);
      throw err;
    }
  }, [filters.orderType]);

  // Filter orders locally for immediate response
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Status filter
    if (filters.status !== 'All') {
      const statusField = filters.orderType === 'ambher' 
        ? 'patientorderambherstatus' 
        : 'patientorderbautistastatus';
      filtered = filtered.filter(order => order[statusField] === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const productNameField = filters.orderType === 'ambher' 
        ? 'patientorderambherproductname' 
        : 'patientorderbautistaproductname';
      
      filtered = filtered.filter(order => 
        order[productNameField]?.toLowerCase().includes(searchLower) ||
        order.patientfirstname?.toLowerCase().includes(searchLower) ||
        order.patientlastname?.toLowerCase().includes(searchLower) ||
        order.patientemail?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [orders, filters]);

  // Pagination handlers
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
    }
  }, [pagination.totalPages, fetchOrders]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  }, [pagination.hasPrevPage, pagination.currentPage, goToPage]);

  // Filter handlers
  const setStatusFilter = useCallback((status) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const setSearchFilter = useCallback((search) => {
    debouncedSearch(search);
  }, [debouncedSearch]);

  const setOrderType = useCallback((orderType) => {
    setFilters(prev => ({ ...prev, orderType }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setOrders([]); // Clear current orders
  }, []);

  // Initial load and refresh on filter changes
  useEffect(() => {
    if (patientemail) {
      fetchOrders(1);
    }
  }, [patientemail, filters.orderType, filters.status, fetchOrders]);

  // Search effect
  useEffect(() => {
    if (filters.search) {
      fetchOrders(1);
    }
  }, [filters.search, fetchOrders]);

  return {
    // Data
    orders: filteredOrders,
    loading,
    error,
    pagination,
    filters,

    // Actions
    fetchOrders,
    loadOrderDetails,
    refresh: () => fetchOrders(pagination.currentPage, true),

    // Pagination
    goToPage,
    nextPage,
    prevPage,

    // Filters
    setStatusFilter,
    setSearchFilter,
    setOrderType,

    // Utilities
    hasOrders: filteredOrders.length > 0,
    isEmpty: !loading && filteredOrders.length === 0,
    isFirstPage: pagination.currentPage === 1,
    isLastPage: pagination.currentPage === pagination.totalPages
  };
};

export default useOptimizedOrders;
