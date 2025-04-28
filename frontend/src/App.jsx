import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RestaurantList from './pages/RestaurantList';
import RestaurantForm from './pages/RestaurantForm';
import RestaurantDetails from './pages/RestaurantDetails';
import NotFound from './pages/NotFound';
import Loader from './components/Loader/Loader';
import Toast from './components/ui/Toast';
function App() {
  return (
    <>
      <Loader />
      <Toast />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/restaurants" replace />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="restaurants/new" element={<RestaurantForm />} />
            <Route path="restaurants/:id" element={<RestaurantDetails />} />
            <Route path="restaurants/:id/edit" element={<RestaurantForm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;