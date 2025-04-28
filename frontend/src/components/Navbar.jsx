import { Link, NavLink } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-primary shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center transition-transform duration-300 hover:scale-105">
            <Link to="/" className="text-white text-xl font-bold flex items-center">
              <Utensils className="h-8 w-8 mr-2 text-white animate-spin-slow" />
              <span className="font-bold tracking-wide">Restaurant Manager</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/restaurants"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-dark-primary text-white shadow-md' 
                    : 'text-white hover:bg-light-primary hover:text-dark-primary'
                  }`
                }
              >
                Restaurants
              </NavLink>
              <NavLink
                to="/restaurants/new"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                    ? 'bg-dark-primary text-white shadow-md' 
                    : 'text-white hover:bg-light-primary hover:text-dark-primary'
                  }`
                }
              >
                Add Restaurant
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;