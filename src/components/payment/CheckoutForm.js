import React, { useState, useEffect } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import io from "socket.io-client";

const socket = io("http://localhost:4004");

const CheckoutForm = ({
  cartItems,
  totalPrice,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fname: "Anonymous",
    email: "anonymous@example.com",
  });

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          fname: parsedUser?.fname || "Anonymous",
          email: parsedUser?.email || "anonymous@example.com",
        });
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!stripe || !elements) {
      setMessage("Stripe not initialized. Please try again.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setMessage("No items in cart.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Create payment intent
      const { data } = await axios.post("/order/stripe/create-payment-intent", {
        amount: Math.round(totalPrice * 100),
        cartItems: cartItems.map((item) => ({
          id: item.inventory_id,
          name: `${item.brand_name} ${item.model_name}`,
          quantity: item.quantity,
          price: item.unit_price,
        })),
      });

      // Emit product purchase details via socket
      cartItems.forEach((item) => {
        const {
          brand_name,
          model_name,
          unit_price: price,
          special_offer = "None",
        } = item;

        socket.emit("buyproduct", {
          fname: user.fname,
          email: user.email,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString(),
          brand_name,
          model_name,
          price: price * item.quantity,
          special_offer,
        });
      });

      socket.on("buyproductSuccess", ({ message }) => {
        window.alert(message);
      });

      const { client_secret } = data;

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.fname,
            },
          },
        }
      );

      if (error) {
        setMessage(error.message || "Payment failed");
        if (onPaymentFailure) onPaymentFailure(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment successful!");
        if (onPaymentSuccess) onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Payment failed";
      setMessage(errorMessage);
      if (onPaymentFailure) onPaymentFailure(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold">Payment Details</h3>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              },
              invalid: {
                color: "#9e2146",
                iconColor: "#9e2146",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {/* Order Summary */}
      <div className="p-4 mb-4 bg-gray-100 rounded-lg">
        <h4 className="mb-2 font-bold">Order Summary</h4>
        {cartItems.map((item) => (
          <div
            key={`${item.orderId}-${item.inventory_id}`}
            className="flex justify-between text-sm"
          >
            <span>
              {item.brand_name} {item.model_name}
            </span>
            <span>
              ${item.unit_price.toFixed(2)} x {item.quantity}
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2 font-bold border-t">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing Payment..." : `Pay $${totalPrice.toFixed(2)}`}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${
            message.includes("successful")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
