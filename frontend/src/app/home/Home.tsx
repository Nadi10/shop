import { Container, Grid, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL}/static/home.avif)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        margin: 0,
      }}
    >
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Grid item xs={6}>
          <Typography variant="h1" sx={{ marginBottom: 2, color: 'black' }}>
            Welcome to our shop!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
