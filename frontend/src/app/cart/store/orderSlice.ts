import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { OrderItem } from "../types/orderItem.type";

interface OrdersState {
  order: OrderItem | null; // Update the type to allow null
}

const initialState: OrdersState = {
  order: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState, dispatch }) => {
  try {
    const response = await axios.get('http://localhost:4200/api/orders/get-orders-by-status', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      params: {
        status: 'PENDING',
      },
    });

    const pendingOrder = response.data.find((order: any) => order.status === 'PENDING');
    dispatch(setOrders(pendingOrder || null));
    return pendingOrder || null;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
});



const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderItem | null>) => {
      state.order = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.order = action.payload;
    });
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
