import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Card className="h-full flex flex-col card-hover transition-all duration-300">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors duration-200">{restaurant.name}</h3>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
            <Phone className="h-4 w-4 text-primary mt-0.5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-sm text-gray-600">{restaurant.phone}</span>
          </div>
          <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
            <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm text-gray-600">{restaurant.streetName}</span>
          </div>
          <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
            <Clock className="h-4 w-4 text-primary mt-0.5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-sm text-gray-600">
              {restaurant.openingTime} - {restaurant.closingTime}
            </span>
          </div>
        </div>

        {restaurant.landmarks && restaurant.landmarks.length > 0 && (
          <div className="mt-4 transform transition-all duration-300">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Nearby</h4>
            <div className="flex flex-wrap gap-1">
              {restaurant.landmarks.map((landmark, index) => (
                <Badge key={index} variant="primary" className="text-xs transition-all duration-200 hover:scale-105">
                  {landmark}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 bg-light-primary border-t border-primary border-opacity-20 transition-colors duration-300">
        <div className="flex justify-between">
          <Link to={`/restaurants/${restaurant.id}`}>
            <Button variant="secondary" size="sm" className="transform hover:-translate-y-1 transition-transform duration-200">View Details</Button>
          </Link>
          <Link to={`/restaurants/${restaurant.id}/edit`}>
            <Button variant="primary" size="sm" className="transform hover:-translate-y-1 transition-transform duration-200">Edit</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;