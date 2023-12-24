import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from '../../repository';
import { AppDispatch, RootState } from "../../store";
import CartItem from "./CartItem";
import { checkToken } from "./store/cart.actions";
import { deleteOrderItem, updateCart, updateTotalPrice } from "./store/cartSlice";
import { fetchOrders, setOrders } from "./store/orderSlice";

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);
  const [tabValue, setTabValue] = React.useState(0);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const currentOrder = useSelector((state: RootState) => state.order.order);
  const orderId = currentOrder?.id || '';

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        await dispatch(checkToken());
        await dispatch(fetchOrders());
        const orderItemsResponse = await api.get(
          'order-items/get-all-order-items',
          {
            params: {
              orderId: orderId,
            },
          }
        );
        dispatch(updateCart(orderItemsResponse.data));
        const total = orderItemsResponse.data.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
        dispatch(updateTotalPrice(total));

        const orderHistoryResponse = await api.get(
          'orders/get-orders-by-status',
          {
            params: {
              status: 'SHIPPED',
            },
          }
        );
        setOrderHistory(orderHistoryResponse.data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [dispatch, orderId]);

  const handleDeleteOrderItem = async (itemId: string) => {
    try {
      await api.delete(`order-items/delete-order-item/${itemId}`);
      dispatch(deleteOrderItem(itemId));
    } catch (error) {
      console.error('Error deleting order item:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (orderId) {
        await api.post('orders/update-status', { id: orderId, status: 'SHIPPED' });
        dispatch(updateCart([]));
        dispatch(setOrders(null));
        dispatch(updateTotalPrice(0));
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  
  const handleCancelOrder = async () => {
    try {
      if (orderId) {
        await api.post('orders/update-status', { id: orderId, status: 'CANCELED' });
        dispatch(updateCart([]));
        dispatch(setOrders(null));
        dispatch(updateTotalPrice(0));
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
  

  return (
    <Box className="cart-container" textAlign="center">
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Current Cart" />
        <Tab label="Orders History" />
      </Tabs>

      {tabValue === 0 && (
        <div>
          <Typography variant="h5">Current Cart</Typography>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              name={item.productName}
              quantity={item.quantity}
              price={item.price}
              id={item.id}
              onDelete={() => handleDeleteOrderItem(item.id)}
            />
          ))}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold">
              TOTAL PRICE
            </Typography>
            <Typography variant="h6">{totalPrice} $</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
            >
              Place Order
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelOrder}
              disabled={cartItems.length === 0} 
            >
              Cancel Order
            </Button>
          </Box>
        </div>
      )}

      {tabValue === 1 && (
        <div>
          <Typography variant="h5">Orders History</Typography>
          {orderHistory.length > 0 ? (
            orderHistory
            .filter((order: any) => order.status !== 'PENDING') 
            .map((order: any) => (
              <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <Typography variant="body2">Order ID: {order.id}</Typography>
                <Typography variant="body2">Price: {order.price} $</Typography>
                <Typography variant="body2">Status: {order.status}</Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2">No orders in history</Typography>
          )}
        </div>
      )}
    </Box>
  );
};

export default Cart;
