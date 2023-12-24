import { Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import api from '../../repository';
import ProductsItem from "./ProductsItem";
import { Product } from "./types/product.type";

const ProductsCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>('products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container sx={{ mt: '1rem' }}>
      <Grid container spacing={2}>
        {products.map(({ id, image, name, price, description }) => (
          <ProductsItem
            key={id}
            image={image}
            name={name}
            price={price}
            description={description}
            productId={id}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsCatalog;
