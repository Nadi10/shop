import React, { FC, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

//======= private route ======= //
const PrivateRoute: FC<{ element: any }> = ({ element: Element }) => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)

  return isLoggedIn ? (
    <Suspense fallback={<div />}>
      <div><Element /></div>
    </Suspense>
  ) : (
    <Navigate to={"/home"} />//
  );
};

//======= public route ======= //
const PublicRoute: FC<{ element: any }> = ({ element: Element }) => (
  <Suspense fallback={<div/>}>
    <Element />
  </Suspense>
);

// ======= pages ======= //
const ProductsCatalog = React.lazy(() => import("./app/products/ProductsCatalog"));
const Home = React.lazy(() => import("./app/home/Home"));
const Cart = React.lazy(() => import("./app/cart/Cart"));
const Auth = React.lazy(() => import("./app/auth/Auth"));


//ROUTING
const AppRoutes = () => {
  return (
    <Routes>
      {/* PRIVATE */}
      {/* Cart */}  
      <Route path={"/cart"} element={<PrivateRoute element={Cart} />} />

      {/* PRODUCTS CATALOG */}
      <Route path="/products" element={<PublicRoute element={ProductsCatalog}/>}/>
      
      {/* Auth */}
      <Route path="/auth" element={<PublicRoute element={Auth}/>} />

      {/* HOME */}
      <Route path="/home" element={<PublicRoute element={Home}/>} />

      {/* DEFAULT */}
      <Route path='*' element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRoutes;
