
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../types/orderItem.type';

interface CartState {
  cartItems: OrderItem[];
  totalPrice: number;
  itemCount: number; 
}

const initialState: CartState = {
  cartItems: [],
  totalPrice: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<OrderItem[]>) => {
      state.cartItems = action.payload;
      state.itemCount = action.payload.length;
    },
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    deleteOrderItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const deletedItem = state.cartItems.find((item) => item.id === itemId);
    
      if (deletedItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        state.totalPrice -= deletedItem.price * deletedItem.quantity;
      }
    }
  },
});


export const { updateCart, updateTotalPrice, deleteOrderItem } = cartSlice.actions;
export default cartSlice;
