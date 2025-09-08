/**
 * Optimized PatientOrders Component
 * Uses pagination, lazy loading, and performance optimizations
 */
import React, { useState, useEffect, useCallback } from 'react';
import useOptimizedOrders from '../hooks/useOptimizedOrders';
import useAuth from '../hooks/patientuseAuth';
import Pagination from '../components/ui/Pagination';
import { LazyOrderLoader } from '../utils/performanceOptimization';

// Skeleton loading component
const OrderSkeleton = () => (
  <div className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 animate-pulse">
    <div className="flex items-center">
      <div className="w-35 h-35 bg-gray-300 rounded-2xl mr-5"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <OrderSkeleton key={index} />
    ))}
  </div>
);

// Optimized Order Item Component
const OrderItem = React.memo(({ order, orderType, onViewOrder }) => {
  const idField = orderType === 'ambher' ? 'patientorderambherid' : 'patientorderbautistaid';
  const statusField = orderType === 'ambher' ? 'patientorderambherstatus' : 'patientorderbautistastatus';
  const productNameField = orderType === 'ambher' ? 'patientorderambherproductname' : 'patientorderbautistaproductname';
  const productImageField = orderType === 'ambher' ? 'patientorderambherproductimage' : 'patientorderbautistaproductimage';
  const productPriceField = orderType === 'ambher' ? 'patientorderambherproductprice' : 'patientorderbautistaproductprice';
  const pickupDateField = orderType === 'ambher' ? 'patientorderambherproductchosenpickupdate' : 'patientorderbautistaproductchosenpickupdate';

  const formatOrderStatus = (status) => {
    const statusColors = {
      'Pending': 'text-orange-600 bg-orange-100',
      'Ready for Pickup': 'text-blue-600 bg-blue-100', 
      'Completed': 'text-green-600 bg-green-100',
      'Cancelled': 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      onClick={() => onViewOrder(order)} 
      className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 flex items-center motion-preset-slide-up w-full h-auto cursor-pointer hover:shadow-lg transition-all duration-300"
    >
      <img 
        src={order[productImageField]?.[0] || '/src/assets/images/defaultimageplaceholder.png'} 
        alt={order[productNameField]} 
        className="mr-5 w-35 h-35 rounded-2xl object-cover"
        loading="lazy"
      />
      <div className="mt-2 h-auto w-full flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-[18px] font-albertsans font-bold text-[#363636] truncate max-w-[200px]">
            {order[productNameField]}
          </h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${formatOrderStatus(order[statusField])}`}>
            {order[statusField]}
          </span>
        </div>
        <p className="text-[14px] font-albertsans font-normal text-[#B6B6B6] mt-1">
          Order #{order[idField]}
        </p>
        <p className="text-[16px] font-albertsans font-semibold text-[#363636] mt-2">
          ₱{order[productPriceField]?.toLocaleString()}
        </p>
        <p className="text-[12px] font-albertsans font-normal text-[#B6B6B6] mt-1">
          Pickup: {formatDate(order[pickupDateField])}
        </p>
      </div>
    </div>
  );
});

function OptimizedPatientOrders() {
  // Auth hook
  const { fetchpatientdetails } = useAuth();
  
  // Patient data
  const [patientData, setPatientData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    profilepicture: ''
  });

  // Order management with optimization
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    setStatusFilter,
    setSearchFilter,
    setOrderType,
    goToPage,
    hasOrders,
    isEmpty
  } = useOptimizedOrders(patientData.email);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Load patient details
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await fetchpatientdetails();
        if (data) {
          setPatientData({
            firstname: data.patientfirstname || '',
            lastname: data.patientlastname || '',
            email: data.patientemail || '',
            profilepicture: data.patientprofilepicture || ''
          });
        }
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };
    loadPatient();
  }, [fetchpatientdetails]);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchFilter(value);
  };

  // Handle view order with lazy loading
  const handleViewOrder = useCallback(async (order) => {
    setLoadingOrderDetails(true);
    try {
      const idField = filters.orderType === 'ambher' ? 'patientorderambherid' : 'patientorderbautistaid';
      const orderDetails = await LazyOrderLoader.fetchOrderDetails(order[idField], filters.orderType);
      setSelectedOrder(orderDetails);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      // Fallback to basic order data
      setSelectedOrder(order);
      setShowOrderModal(true);
    } finally {
      setLoadingOrderDetails(false);
    }
  }, [filters.orderType]);

  // Status filter options
  const statusOptions = ['All', 'Pending', 'Ready for Pickup', 'Completed'];

  // Get status counts for display
  const getStatusCount = (status) => {
    if (status === 'All') return orders.length;
    const statusField = filters.orderType === 'ambher' ? 'patientorderambherstatus' : 'patientorderbautistastatus';
    return orders.filter(order => order[statusField] === status).length;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={patientData.profilepicture || '/src/assets/images/defaulticon.png'} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {patientData.firstname} {patientData.lastname}
              </h1>
              <p className="text-gray-600">{patientData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Type Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setOrderType('ambher')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filters.orderType === 'ambher'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ambher Optical Orders
          </button>
          <button
            onClick={() => setOrderType('bautista')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filters.orderType === 'bautista'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bautista Eye Center Orders
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <OrderListSkeleton />
        ) : isEmpty ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {filters.status !== 'All' || filters.search 
                ? 'Try adjusting your filters or search terms.'
                : 'You haven\'t placed any orders yet.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {filters.orderType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center'} Orders
              </h2>
              {orders.map(order => (
                <OrderItem
                  key={filters.orderType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid}
                  order={order}
                  orderType={filters.orderType}
                  onViewOrder={handleViewOrder}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={goToPage}
                loading={loading}
              />
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {loadingOrderDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3">Loading order details...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order details content would go here */}
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedOrder, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptimizedPatientOrders;
