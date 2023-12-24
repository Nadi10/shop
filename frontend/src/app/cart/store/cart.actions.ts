
import { Action, createAction } from '@reduxjs/toolkit';
import { OrderItem } from '../types/orderItem.type';

export const updateCart = createAction<OrderItem[]>('cart/updateCart');
export const updateTotalPrice = createAction<number>('cart/updateTotalPrice');
export const checkToken = (): Action => ({
  type: 'CHECK_TOKEN',
});
