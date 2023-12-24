import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './app.routes';
import Header from './components/Header';
import ErrorBoundaryComp from './components/error-boundary.comp';
import store from './store';

function App() {
  useEffect(() => {
    store.dispatch({ type: 'APP_LOADED' });
  }, []);


  
   return (
    <ErrorBoundaryComp>
      <Provider store={store}>
        <Router>
          <Header/>
          <AppRoutes />
        </Router>
      </Provider>
    </ErrorBoundaryComp>
  );
}

export default App;
