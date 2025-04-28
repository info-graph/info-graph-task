import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, AlertCircle, X, Info, Clock, ThumbsUp, Bell } from 'lucide-react';
import { hideToast, selectToast } from '../../store/restaurants';

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const [isClosing, setIsClosing] = useState(false);
  
  const { visible, message, type, title, duration = 3000, data } = toast;
  
  const variants = {
    success: {
      bg: 'bg-white',
      border: 'border-accent',
      icon: 'text-accent',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: CheckCircle,
      defaultTitle: 'Success',
    },
    error: {
      bg: 'bg-white',
      border: 'border-danger',
      icon: 'text-danger',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: AlertCircle,
      defaultTitle: 'Error',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-primary',
      icon: 'text-primary',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: AlertCircle,
      defaultTitle: 'Warning',
    },
    info: {
      bg: 'bg-white',
      border: 'border-primary',
      icon: 'text-primary',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: Info,
      defaultTitle: 'Information',
    },
    delay: {
      bg: 'bg-white',
      border: 'border-primary',
      icon: 'text-primary',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: Clock,
      defaultTitle: 'Delayed',
    },
    approval: {
      bg: 'bg-white',
      border: 'border-accent',
      icon: 'text-accent',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: ThumbsUp,
      defaultTitle: 'Approved',
    },
    notification: {
      bg: 'bg-white',
      border: 'border-primary',
      icon: 'text-primary',
      title: 'text-primary',
      text: 'text-gray-600',
      iconComponent: Bell,
      defaultTitle: 'Notification',
    }
  };
  
  const templates = {
    restaurantAdded: (data) => ({
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Restaurant Added Successfully',
      message: (
        <div className="text-gray-600 text-sm">
          <span className="font-medium">{data.restaurantName}</span> has been added to your restaurant list.
        </div>
      ),
      borderColor: 'border-accent',
      iconColor: 'text-accent'
    }),
    restaurantUpdated: (data) => ({
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Restaurant Updated Successfully',
      message: (
        <div className="text-gray-600 text-sm">
          <span className="font-medium">{data.restaurantName}</span> has been updated successfully.
        </div>
      ),
      borderColor: 'border-primary',
      iconColor: 'text-primary'
    }),
    menuItemAdded: (data) => ({
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Menu Item Added',
      message: (
        <div className="text-gray-600 text-sm">
          <span className="font-medium">{data.itemName}</span> has been added to the menu.
        </div>
      ),
      borderColor: 'border-accent',
      iconColor: 'text-accent'
    }),
    maintenanceScheduled: (data) => ({
      icon: <Clock className="h-5 w-5" />,
      title: 'Maintenance Scheduled',
      message: (
        <div className="text-gray-600 text-sm">
          Maintenance for <span className="font-medium">{data.restaurantName}</span> scheduled from {data.startDate} to {data.endDate}.
        </div>
      ),
      borderColor: 'border-primary',
      iconColor: 'text-primary'
    })
  };
  
  const colors = variants[type] || variants.success;
  const IconComponent = colors.iconComponent;
  const toastTitle = title || colors.defaultTitle;
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      dispatch(hideToast());
      setIsClosing(false);
    }, 300);
  };
  
  useEffect(() => {
    if (!visible) return;
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [visible, duration]);
  
  if (!visible) return null;
  
  const templateKey = data?.templateType;
  if (templateKey && templates[templateKey] && data) {
    const template = templates[templateKey](data);
    
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className={`bg-white border-l-4 ${template.borderColor} rounded-md shadow-lg p-4 max-w-md
                    transition-all duration-500 ease-bounce
                    ${isClosing ? 'opacity-0 translate-x-2' : 'opacity-100 animate-fadeIn'}`}
        >
          <div className="flex items-start">
            <div className={`${template.iconColor} flex-shrink-0 mr-3 transition-transform duration-300 hover:scale-110`}>
              {template.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-primary text-sm font-medium mb-1 font-serif">
                {template.title}
              </h3>
              {template.message}
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-500 ml-4 inline-flex hover:bg-light-primary p-1 rounded-full transition-colors duration-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Special case for restaurant added (for backward compatibility)
  if (type === 'success' && data?.restaurantName && !templateKey) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className={`bg-white border-l-4 border-accent rounded-md shadow-lg p-4 max-w-md
                    transition-all duration-500 ease-bounce
                    ${isClosing ? 'opacity-0 translate-x-2' : 'opacity-100 animate-fadeIn'}`}
        >
          <div className="flex items-start">
            <div className="text-accent flex-shrink-0 mr-3 transition-transform duration-300 hover:scale-110">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-primary text-sm font-medium mb-1 font-serif">
                Restaurant Added Successfully
              </h3>
              <div className="text-gray-600 text-sm">
                <span className="font-medium">{data.restaurantName}</span> has been added to your restaurant list.
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-500 ml-4 inline-flex hover:bg-light-primary p-1 rounded-full transition-colors duration-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`${colors.bg} border-l-4 ${colors.border} rounded-md shadow-lg p-4 max-w-md
                  transition-all duration-500 ease-bounce
                  ${isClosing ? 'opacity-0 translate-x-2' : 'opacity-100 animate-fadeIn'}`}
      >
        <div className="flex items-start">
          <div className={`${colors.icon} flex-shrink-0 mr-3 transition-transform duration-300 hover:scale-110`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className={`${colors.title} text-sm font-medium mb-1 font-serif`}>
              {toastTitle}
            </h3>
            <div className={`${colors.text} text-sm`}>
              {message}
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-500 ml-4 inline-flex hover:bg-light-primary p-1 rounded-full transition-colors duration-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;