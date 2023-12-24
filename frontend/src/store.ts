import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./app/auth/store/authSlice";
import cartSlice from "./app/cart/store/cartSlice";
import orderSlice from "./app/cart/store/orderSlice";
import checkTokenMiddleware from "./middleware";

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice.reducer,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenMiddleware), 
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
