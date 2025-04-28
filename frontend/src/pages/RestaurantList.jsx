import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { fetchAllRestaurants } from '../store/restaurant'
import { useDispatch, useSelector } from 'react-redux';

const RestaurantList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const restaurants = useSelector((state)=>state.restaurant.restaurants)
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
       await dispatch(fetchAllRestaurants());
        setTimeout(() => {

          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [dispatch]);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.streetName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <Link to="/restaurants/new">
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
          >
            Add Restaurant
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <FormInput
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading restaurants...</p>
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No restaurants found. Try adjusting your search or add a new restaurant.</p>
        </div>
      )}
      
    </div>
  );
};

export default RestaurantList;