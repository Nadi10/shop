import { Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface CartItemProps {
  id: string;
  name: string;
  quantity: number;
  price: number;
  onDelete: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ name, quantity, price, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(); 
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle1">Quantity: {quantity}</Typography>
        <Typography variant="subtitle1">Price: {price}</Typography>
        <Button variant="outlined" onClick={handleDelete}>Remove from Cart</Button>
      </CardContent>
    </Card>
  );
};

export default CartItem;
