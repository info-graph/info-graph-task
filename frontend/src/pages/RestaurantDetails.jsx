import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Calendar, DollarSign, Trash2, Edit, ArrowLeft, AlertTriangle, Menu } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantWithRelations, deleteRestaurant } from '../store/restaurant';
import ReadOnlyMap from '../components/forms/ReadOnlyMap';
import { setLoading } from '../store/restaurants';
import { useToast } from '../hooks/useToast';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('danger');
  const [currentTime, setCurrentTime] = useState(0);
  const dispatch = useDispatch();
  const stateRes = useSelector((state) => state.restaurant.currentRestaurant);
  const toast = useToast();
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.getHours() * 60 + now.getMinutes());
    };

    updateCurrentTime();

    const interval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkIfOpen = (restaurant) => {
    if (!restaurant) return false;

    const [openHour, openMinute] = restaurant.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = restaurant.closingTime.split(':').map(Number);

    const openingTime = openHour * 60 + openMinute;
    const closingTime = closeHour * 60 + closeMinute;

    let hasActiveMaintenance = false;
    let maintenanceImpact = null;

    if (restaurant.maintenanceRecords && restaurant.maintenanceRecords.length > 0) {
      const today = new Date();

      for (const record of restaurant.maintenanceRecords) {
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);

        if (today >= startDate && today <= endDate) {
          hasActiveMaintenance = true;
          maintenanceImpact = record.impactLevel;
          break;
        }
      }
    }

    if (hasActiveMaintenance) {
      if (maintenanceImpact === 'complete') {
        setStatusMessage('Closed for Maintenance');
        setStatusVariant('danger');
        return false;
      } else if (maintenanceImpact === 'partial') {
        if (currentTime >= openingTime && currentTime < closingTime) {
          setStatusMessage('Open (Limited Service)');
          setStatusVariant('warning');
          return true;
        } else {
          setStatusMessage('Closed (After Hours)');
          setStatusVariant('danger');
          return false;
        }
      }
    }

    if (currentTime >= openingTime && currentTime < closingTime) {
      setStatusMessage('Currently Open');
      setStatusVariant('success');
      return true;
    } else {
      setStatusMessage('Currently Closed');
      setStatusVariant('danger');
      return false;
    }
  };

  const isMenuItemAvailable = (item) => {
    if (!isCurrentlyOpen || !item) return false;

    const [startHour, startMinute] = item.serving_start_time.split(':').map(Number);
    const [endHour, endMinute] = item.serving_end_time.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime < endTime;
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      dispatch(setLoading(true));
      await dispatch(fetchRestaurantWithRelations(id));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1000);
    };

    fetchRestaurant();
  }, [id, dispatch]);

  useEffect(() => {
    if (stateRes) {
      setIsCurrentlyOpen(checkIfOpen(stateRes));
    }
  }, [stateRes, currentTime]);

  const handleDelete = async (id) => {
    const resultAction = await dispatch(deleteRestaurant(id));
    if (resultAction.meta?.requestStatus === 'fulfilled') {
      navigate(`/restaurants`);
      dispatch(setLoading(false))
      toast.delayed().success("The restaurant have been deleted successfully");
      return true;
    }
    else {
      toast.delayed().error("There is a problem with the server please try later");

    }

  };

  const impactLevelDisplay = {
    'normal': { text: 'Normal Operations', variant: 'success' },
    'partial': { text: 'Partial Shutdown', variant: 'warning' },
    'complete': { text: 'Complete Shutdown', variant: 'danger' }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getTimeRemaining = (item) => {
    if (!item) return '';

    const [endHour, endMinute] = item.serving_end_time.split(':').map(Number);
    const endTimeInMinutes = endHour * 60 + endMinute;

    const remainingMinutes = endTimeInMinutes - currentTime;

    if (remainingMinutes <= 0) return '';

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const getTimeUntilAvailable = (item) => {
    if (!item) return '';

    const [startHour, startMinute] = item.serving_start_time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;

    const minutesUntilAvailable = startTimeInMinutes - currentTime;

    if (minutesUntilAvailable <= 0) return '';

    const hours = Math.floor(minutesUntilAvailable / 60);
    const minutes = minutesUntilAvailable % 60;

    if (hours > 0) {
      return `Available in ${hours}h ${minutes}m`;
    }
    return `Available in ${minutes}m`;
  };

  const checkActiveMaintenance = () => {
    if (!stateRes?.maintenanceRecords || stateRes.maintenanceRecords.length === 0) {
      return false;
    }
    const today = new Date();

    for (const record of stateRes.maintenanceRecords) {
      const startDate = new Date(record.startDate);
      const endDate = new Date(record.endDate);

      if (today >= startDate && today <= endDate) {
        return record;
      }
    }
    return false;
  };

  const activeMaintenance = stateRes ? checkActiveMaintenance() : false;

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6 animate-fadeIn">
        <div>
          <Link to="/restaurants" className="text-primary hover:text-dark-primary flex items-center text-sm font-medium transition-all duration-200 hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Restaurants
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors duration-300 mt-2">{stateRes?.name}</h1>
        </div>
        <div className="flex space-x-3">
          <Link to={`/restaurants/${id}/edit`}>
            <Button
              variant="secondary"
              icon={<Edit className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />}
              className="transform hover:-translate-y-1 transition-transform duration-200"
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            icon={<Trash2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />}
            onClick={() => setShowDeleteConfirm(true)}
            className="transform hover:-translate-y-1 transition-transform duration-200"
          >
            Delete
          </Button>
        </div>
      </div>

      {activeMaintenance && activeMaintenance.impactLevel !== 'normal' && (
        <div className={`mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center ${activeMaintenance.impactLevel === 'complete' ? 'bg-red-50 border-red-200' : ''
          }`}>
          <AlertTriangle className={`h-5 w-5 mr-2 ${activeMaintenance.impactLevel === 'complete' ? 'text-red-500' : 'text-yellow-500'
            }`} />
          <div>
            <p className="font-medium">
              {activeMaintenance.impactLevel === 'complete'
                ? 'Currently Under Complete Maintenance'
                : 'Currently Under Partial Maintenance'}
            </p>
            <p className="text-sm text-gray-600">
              {activeMaintenance.startDate.split('T')[0]} to {activeMaintenance.endDate.split('T')[0]}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
                  <Phone className="h-5 w-5 text-primary mt-0.5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{stateRes?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{stateRes?.streetName}</p>
                  </div>
                </div>

                <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
                  <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hours</p>
                    <p className="text-gray-900">{formatTime(stateRes?.openingTime)} - {formatTime(stateRes?.closingTime)}</p>
                  </div>
                </div>

                <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
                  <Badge
                    variant={statusVariant}
                    className="mt-0.5 mr-3 transition-all duration-300"
                  >
                    {isCurrentlyOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-gray-900">{statusMessage}</p>
                  </div>
                </div>
              </div>

              {stateRes?.landmarks && stateRes?.landmarks.length > 0 && (
                <div className="mt-6 transform transition-all duration-300">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nearby Landmarks</h3>
                  <div className="flex flex-wrap gap-2">
                    {stateRes?.landmarks.map((landmark, index) => (
                      <Badge key={index} variant="primary" className="transition-all duration-200 hover:scale-105">
                        {landmark}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Menu className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 font-serif">Menu Items</h2>
              </div>

              {stateRes?.menuItems && stateRes?.menuItems.length > 0 ? (
                <div className="space-y-4">
                  {stateRes?.menuItems.map((item, index) => {
                    const available = isMenuItemAvailable(item);
                    const timeRemaining = available ? getTimeRemaining(item) : '';
                    const timeUntilAvailable = !available && isCurrentlyOpen ? getTimeUntilAvailable(item) : '';

                    return (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg transition-all duration-200 bg-white ${available
                          ? 'border-green-200 hover:border-green-300 hover:shadow-md shadow-sm'
                          : 'border-gray-100 hover:border-primary hover:shadow-md'
                          }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-lg text-gray-900">{item.name}</h3>
                          <span className="font-bold text-primary text-lg">{formatPrice(item.price)}</span>
                        </div>

                        <p className="text-gray-600 mb-3 text-sm">{item.description || "No description available"}</p>

                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <Badge variant="secondary" className="transition-all duration-200">
                            Available: {formatTime(item.serving_start_time)} - {formatTime(item.serving_end_time)}
                          </Badge>

                          {available && (
                            <div className="flex items-center">
                              <Badge
                                variant="success"
                                className="transition-all duration-200 mr-2"
                              >
                                Currently Available
                              </Badge>
                              {timeRemaining && (
                                <span className="text-xs text-gray-500">{timeRemaining}</span>
                              )}
                            </div>
                          )}

                          {!available && isCurrentlyOpen && timeUntilAvailable && (
                            <Badge
                              variant="warning"
                              className="transition-all duration-200"
                            >
                              {timeUntilAvailable}
                            </Badge>
                          )}

                          {!available && isCurrentlyOpen && !timeUntilAvailable && (
                            <Badge
                              variant="danger"
                              className="transition-all duration-200"
                            >
                              Not Available Today
                            </Badge>
                          )}

                          {!isCurrentlyOpen && (
                            <Badge
                              variant="danger"
                              className="transition-all duration-200"
                            >
                              Restaurant Closed
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Menu className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No menu items available.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Maintenance History</h2>

              {stateRes?.maintenanceRecords && stateRes?.maintenanceRecords.length > 0 ? (
                <div className="space-y-4">
                  {stateRes.maintenanceRecords.map((record) => (
                    <div key={record.id} className={`p-4 rounded-lg ${checkActiveMaintenance() && checkActiveMaintenance().id === record.id
                      ? 'bg-blue-50 border border-blue-100'
                      : 'border border-gray-100'
                      }`}>
                      <div className="flex items-start group hover:translate-x-1 transition-transform duration-200">
                        <Calendar className="h-5 w-5 text-primary mt-0.5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date Range</p>
                          <p className="text-gray-900">
                            {new Date(record.startDate).toLocaleDateString()} to {new Date(record.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start group hover:translate-x-1 transition-transform duration-200 mt-3">
                        <div className="mt-0.5 mr-3">
                          <Badge
                            variant={impactLevelDisplay[record.impactLevel].variant}
                            className="transition-all duration-300"
                          >
                            {impactLevelDisplay[record.impactLevel].text}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Impact Level</p>
                          <p className="text-gray-900">
                            {impactLevelDisplay[record.impactLevel].text}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start group hover:translate-x-1 transition-transform duration-200 mt-3">
                        <DollarSign className="h-5 w-5 text-primary mt-0.5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cost</p>
                          <p className="text-gray-900">${record.cost}</p>
                        </div>
                      </div>

                      {record.comments && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">Comments</p>
                          <p className="text-gray-700 hover:text-primary transition-colors duration-300">{record.comments}</p>
                        </div>
                      )}

                      {checkActiveMaintenance() && checkActiveMaintenance().id === record.id && (
                        <div className="mt-3">
                          <Badge variant="info">Currently Active</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No maintenance history available.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Location</h2>

          <div className="w-full h-64 mb-4 border border-primary border-opacity-20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <ReadOnlyMap
              latitude={stateRes?.latitude}
              longitude={stateRes?.longitude}
              address={stateRes?.streetName}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p className="hover:text-primary transition-colors duration-200">{stateRes?.streetName}</p>
            {stateRes?.latitude && stateRes?.longitude && (
              <p className="mt-1 hover:text-primary transition-colors duration-200">
                Coordinates: {parseFloat(stateRes?.latitude).toFixed(6)}, {parseFloat(stateRes?.longitude).toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-serif">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete {stateRes?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(stateRes?.id)}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;