import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { Badge, Grid, IconButton, Input, Paper, styled } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import api from '../../repository';
import { checkToken } from '../cart/store/cart.actions';
import { ProductItem } from './types/productItem.type';
import { setOrders } from '../cart/store/orderSlice';

const CounterWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  minWidth: theme.spacing(8),
}));

const ProductsItem: React.FC<ProductItem> = ({ image, name, price, description, productId }) => {
  const [quantity, setQuantity] = useState(0);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10) || 0;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(checkToken());
      const orderResponse = await api.post(`orders/create-order`, { status: 'PENDING' });
      const orderId = orderResponse.data.id;
      dispatch(setOrders(orderResponse.data));
      await api.post(`order-items/create-order-item`, {
        quantity,
        productId,
        orderId,
      });
      setQuantity(0);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setIsErrorOpen(true);
      }
    }
  };

  const handleCloseError = () => {
    setIsErrorOpen(false);
  };

  return (
    <Grid item xs={12} md={4}>
      <ErrorSnackbar open={isErrorOpen} message={errorMessage} onClose={handleCloseError} />
      <Card sx={{ minHeight: 390 }}>
        <CardOverflow>
          <AspectRatio sx={{ minWidth: 200 }}>
            <img src={image} alt={name} />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="body-xs">{name}</Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="title-lg" sx={{ fontWeight: 'xl' }}>
              {price} $
            </Typography>
            <CounterWrapper>
              <IconButton onClick={handleDecrement} size="small" sx={{ color: 'white' }}>
                <RemoveIcon />
              </IconButton>
              <Badge badgeContent={quantity} color="primary">
                <Input
                  value={quantity}
                  onChange={handleQuantityChange}
                  disableUnderline
                  inputProps={{ style: { textAlign: 'center', color: 'black' } }}
                  sx={{ width: '30px', backgroundColor: 'white', borderRadius: '5px' }}
                />
              </Badge>
              <IconButton onClick={handleIncrement} size="small" sx={{ color: 'white' }}>
                <AddIcon />
              </IconButton>
            </CounterWrapper>
          </div>
          <Typography level="body-sm">{description}</Typography>
        </CardContent>
        <CardOverflow>
          <Button variant="solid" color="primary" size="lg" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </CardOverflow>
      </Card>
    </Grid>
  );
};

export default ProductsItem;
