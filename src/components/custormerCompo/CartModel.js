import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../payment/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import Orders from './Orders';
import {  FaCartPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';



const CartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placeAddress, setPlaceAddress] = useState('');
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const { user } = useContext(UserContext);
  
  const stripePromise = loadStripe('pk_test_51QSgJEAmilHOBn6cQ0yhtMDnzqs98UozfcFrDEBco1EItSseJDO75SlhVDI2llcMjtFxu75iWgijdrjoybV5hsMx00TPEHoj3R');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');

  
  // Updated payment handler
  const handlepayment = async () => {
    if (!placeAddress.trim()) {
      setError('Please add a delivery address before proceeding');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Update all cart orders as paid
      const orderIds = [...new Set(cartItems.map(item => item.orderId))];
      
      // First, reduce stock levels for each item in the cart
      const stockReductionPromises = cartItems.map(async (item) => {
        try {
          // Reduce stock level for each product
          await axios.put(`/inventory/reducestocklevel/${item.inventory_id}`, {
            quantity: item.quantity
          });
        } catch (stockError) {
          console.error(`Error reducing stock for item ${item.inventory_id}:`, stockError);
          // Optionally throw or handle stock reduction errors
          throw new Error(`Failed to reduce stock for item ${item.brand_name} ${item.model_name}`);
        }
      });
  
      // Wait for all stock reductions to complete
      await Promise.all(stockReductionPromises);
  
      // Update orders as paid
      const orderUpdatePromises = orderIds.map(async (orderId) => {
        await axios.put(`/order/update/${orderId}`, {
          ispayed: true,
          payment_intent_id: paymentIntent.id
        });
      });
  
      // Wait for all order updates to complete
      await Promise.all(orderUpdatePromises);
  
      // Reset cart and close modals
      setCartItems([]);
      setIsPaymentModalOpen(false);
      onClose();

      //success message
      toast.success('Payment successful!');
  
      
    } catch (err) {
      console.error('Error processing payment and updating inventory:', err);
      setError(err.message || 'Failed to process payment and update inventory');
    }
  };
  // Payment failure handler
  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setError('Payment processing failed. Please try again.');
  };

  // Fetch cart data and inventory details when modal is opened
  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!isOpen || !user) return;

      try {
        setLoading(true);
        // Fetch unpaid orders for the specific user
        const response = await axios.get(`/order/user/${user._id}/unpaid`);
        const orders = response.data.data;

        // Flatten products from all unpaid orders
        const userProducts = orders.flatMap(order => 
          order.products.map(product => ({
            ...product,
            orderId: order._id,
            place_address: order.place_address || '',
          }))
        );

        // Fetch inventory details for each product
        const inventoryDetailsPromises = userProducts.map(async (item) => {
          try {
            const inventoryResponse = await axios.get(`/inventory/getinventorybyid/${item.inventory_id}`);
            return {
              ...item,
              brand_name: inventoryResponse.data.brand_name || '',
              model_name: inventoryResponse.data.model_name || '',
              images: inventoryResponse.data.images || [],
              image: inventoryResponse.data.images && inventoryResponse.data.images.length > 0 
                ? inventoryResponse.data.images[0] 
                : ''
            };
          } catch (error) {
            console.error('Error fetching inventory details:', error);
            return {
              ...item,
              brand_name: '',
              model_name: '',
              images: [],
              image: ''
            };
          }
        });

        const detailedProducts = await Promise.all(inventoryDetailsPromises);

        setCartItems(detailedProducts);
        setPlaceAddress(detailedProducts[0]?.place_address || '');
      } catch (err) {
        console.error('Error fetching cart details:', err);
        setError('Failed to load cart details');
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, [isOpen, user]);

  // Calculate total price of all cart items
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.total_price, 0).toFixed(2);
  };

  // Handle adding quantity to an item
  const handleAddQuantity = async (orderId, productId) => {
    try {
      const currentItem = cartItems.find(
        item => item.orderId === orderId && item.inventory_id === productId
      );

      if (!currentItem) return;

      const newQuantity = currentItem.quantity + 1;

      await axios.put(`/order/update/${orderId}`, {
        products: cartItems.map(item =>
          item.orderId === orderId && item.inventory_id === productId
            ? { 
                ...item, 
                quantity: newQuantity,
                total_price: newQuantity * item.unit_price
              }
            : item
        ),
        place_address: placeAddress
      });

      setCartItems(cartItems.map(item =>
        item.orderId === orderId && item.inventory_id === productId
          ? { 
              ...item, 
              quantity: newQuantity,
              total_price: newQuantity * item.unit_price
            }
          : item
      ));
    } catch (err) {
      console.error('Error adding quantity:', err);
      setError('Failed to add quantity');
    }
  };

  // Handle decreasing quantity of an item
  const handleDecreaseQuantity = async (orderId, productId) => {
    try {
      const currentItem = cartItems.find(
        item => item.orderId === orderId && item.inventory_id === productId
      );

      if (!currentItem) return;

      if (currentItem.quantity === 1) {
        return handleRemoveItem(orderId, productId);
      }

      const newQuantity = currentItem.quantity - 1;

      await axios.put(`/order/update/${orderId}`, {
        products: cartItems.map(item =>
          item.orderId === orderId && item.inventory_id === productId
            ? { 
                ...item, 
                quantity: newQuantity,
                total_price: newQuantity * item.unit_price
              }
            : item
        ),
        place_address: placeAddress
      });

      setCartItems(cartItems.map(item =>
        item.orderId === orderId && item.inventory_id === productId
          ? { 
              ...item, 
              quantity: newQuantity,
              total_price: newQuantity * item.unit_price
            }
          : item
      ));
    } catch (err) {
      console.error('Error decreasing quantity:', err);
      setError('Failed to decrease quantity');
    }
  };

  // Handler to remove an item from the cart
  const handleRemoveItem = async (orderId, productId) => {
    try {
      const updatedProducts = cartItems
        .filter(item => 
          !(item.orderId === orderId && item.inventory_id === productId)
        );

      await axios.put(`/order/update/${orderId}`, {
        products: updatedProducts,
        place_address: placeAddress
      });

      setCartItems(updatedProducts);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart');
    }
  };

  // Handle address saving
  const handleSaveAddress = async () => {
    if (!placeAddress.trim()) {
      setError('Please enter a valid address');
      return;
    }

    try {
      const orderIds = [...new Set(cartItems.map(item => item.orderId))];
      
      await Promise.all(orderIds.map(async (orderId) => {
        await axios.put(`/order/update/${orderId}`, {
          place_address: placeAddress
        });
      }));

      setIsAddressEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg w-[50%] h-[80%] flex flex-col justify-center">
        <div className='flex justify-between'>
          <div className='flex items-center justify-center'>
            <div>
               <p className="flex pr-4 mb-4 text-3xl font-bold text-orange-500"><FaCartPlus/></p>          
            </div>
            <div>
              <p className="flex mb-4 text-3xl font-bold text-orange-500">Cart</p>
            </div>
                     
          </div>
          <div>
                     <div className='flex mb-4'>
            <button 
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 mx-2 rounded-lg ${activeTab === 'wishlist' 
                ? 'bg-[#19191A] text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              Wishlist
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 mx-2 rounded-lg ${activeTab === 'orders' 
                ? 'bg-[#19191A] text-white' 
                : 'bg-gray-200 text-gray-700'}`}
            >
              Orders
            </button>
        </div>
          </div>

                  {/* Tab Navigation */}
         
        
        </div>

        <div className='overflow-y-auto px-10 py-10 border-2 border-orange-500 rounded-lg h-[80%]'>
          
          
            {activeTab === 'wishlist' && (<div>
              {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading cart details...</p>
          </div>
        )}

        {error && (
          <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className='mb-8 '><h1 className="mb-4 text-2xl font-bold">Wishlist</h1></div>


        {!loading && cartItems.length === 0 && (
          <div className="flex items-center justify-center flex-grow">
            <p className="text-lg text-gray-500">Your wishlist is empty!</p>
          </div>
        )}
        
        {!loading && cartItems.length > 0 && (
          <div className="flex-grow px-5 py-5 pr-2 overflow-y-auto border rounded-lg">
            
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li 
                  key={`${item.orderId}-${item.inventory_id}`} 
                  className="flex items-center justify-between pb-3 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt='Product' 
                          className="object-cover w-16 h-16 border rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-16 h-16 text-gray-500 bg-gray-200 rounded-lg">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.brand_name || 'Unknown Brand'}</h3>
                      <p>{item.model_name || 'Unknown Model'}</p>
                      <p className="text-sm text-gray-500">
                        Unit Price: ${item.unit_price ? item.unit_price.toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.orderId, item.inventory_id)}
                        className="w-8 h-8 text-lg font-bold text-gray-600 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleAddQuantity(item.orderId, item.inventory_id)}
                        className="w-8 h-8 text-lg font-bold text-gray-600 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-green-600">
                      Total: ${item.total_price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.orderId, item.inventory_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 mb-4 text-start">
              <label 
                htmlFor="place_address" 
                className="block mb-2 text-sm font-medium text-orange-500"
              >
                Delivery Address
              </label>
              
              {isAddressEditing ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="place_address"
                    value={placeAddress}
                    onChange={(e) => setPlaceAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSaveAddress}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsAddressEditing(false)}
                    className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className={`flex-grow ${placeAddress ? 'text-gray-800' : 'text-gray-500'}`}>
                    {placeAddress || 'No address added'}
                  </p>
                  <button 
                    onClick={() => setIsAddressEditing(true)}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    {placeAddress ? 'Edit' : 'Add Address'}
                  </button>
                </div>
              )}

              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {!loading && cartItems.length > 0 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotalPrice()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-4 space-x-4">
          
          <button
            onClick={handlepayment}
            disabled={cartItems.length === 0}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            payment confirm
          </button>
        </div>
        {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="mb-4 text-xl font-bold">Complete Payment</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                cartItems={cartItems}
                totalPrice={parseFloat(calculateTotalPrice())}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
              />
            </Elements>
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="w-full py-2 mt-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
        
      )}
            </div>)}
        
          
          
          {activeTab === 'orders' && (
          <div className=''>
        <Orders/>
      </div>
    )}
          
        </div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 w-[200px]"
          >
            Close
          </button>
        </div>

        
      
      </div>
      
    </div>
  );
};

export default CartModal;