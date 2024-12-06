import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { Package, Truck, CheckCircle } from 'lucide-react';

export default function Orders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`/order/user/${user._id}/paid`);
        const ordersWithInventoryDetails = await Promise.all(
          response.data.data.map(async (order) => {
            const productsWithDetails = await Promise.all(
              order.products.map(async (product) => {
                try {
                  const inventoryResponse = await axios.get(`/inventory/getinventorybyid/${product.inventory_id}`);
                  return {
                    ...product,
                    brand_name: inventoryResponse.data.brand_name || '',
                    model_name: inventoryResponse.data.model_name || '',
                    images: inventoryResponse.data.images || [],
                    image: inventoryResponse.data.images && inventoryResponse.data.images.length > 0 
                      ? inventoryResponse.data.images[0] 
                      : ''
                  };
                } catch (inventoryError) {
                  console.error(`Error fetching inventory for product ${product.inventory_id}:`, inventoryError);
                  return product;
                }
              })
            );

            return {
              ...order,
              products: productsWithDetails
            };
          })
        );

        setOrders(ordersWithInventoryDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getOrderStatus = (order) => {
    if (order.isdelivered) return { 
      text: 'Delivered', 
      color: 'text-green-500', 
      icon: <CheckCircle />
    };
    if (order.ispacked) return { 
      text: 'In Transit', 
      color: 'text-blue-500', 
      icon: <Truck />
    };
    return { 
      text: 'Packing', 
      color: 'text-yellow-500', 
      icon: <Package />
    };
  };

  const renderOrderTracking = (order) => {
    const stages = [
      { name: 'Packing', completed: order.ispayed },
      { name: 'In Transit', completed: order.ispacked },
      { name: 'Delivered', completed: order.isdelivered }
    ];

    return (
      <div className="flex items-center justify-between mt-2">
        {stages.map((stage, index) => (
          <div 
            key={stage.name} 
            className={`flex flex-col items-center ${stage.completed ? 'text-green-500' : 'text-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="mt-1 text-xs">{stage.name}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="text-center">Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found</div>
      ) : (
        orders.map((order) => {
          const status = getOrderStatus(order);
          return (
            <div 
              key={order._id} 
              className="p-4 mb-4 border rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`${status.color}`}>{status.icon}</span>
                  <span className="font-medium">{status.text}</span>
                </div>
                <span className="text-gray-600">
                  Order Total: ${order.overall_total_price.toFixed(2)}
                </span>
              </div>

              {renderOrderTracking(order)}

              <div className="mt-4 space-y-2 overflow-y-auto max-h-64">
                {order.products.map((product) => (
                  <div 
                    key={product.inventory_id} 
                    className="flex items-center pb-2 space-x-4 border-b last:border-b-0"
                  >
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={`${product.brand_name} ${product.model_name}`} 
                        className="object-cover w-20 h-20 rounded"
                      />
                    )}
                    <div className="flex-grow">
                      <div className="font-medium">
                        {product.brand_name} {product.model_name}
                      </div>
                      <div className="text-gray-600">
                        Qnt: {product.quantity}
                      </div>
                      
                    </div>
                  </div>
                ))}
                    

              </div>
                    <div className="text-sm text-left text-black">
                        <span className='text-orange-500'>Collect your order :</span> {order.place_address}
                      </div>
            </div>
          );
        })
      )}
    </div>
  );
}