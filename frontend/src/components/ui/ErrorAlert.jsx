import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Alert = ({ message, onClose, variant = 'error', title }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const variants = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700',
      iconComponent: AlertCircle,
      defaultTitle: 'Unable to save restaurant information'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      icon: 'text-amber-500',
      title: 'text-amber-800',
      text: 'text-amber-700',
      iconComponent: AlertCircle,
      defaultTitle: 'Warning'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      icon: 'text-green-500',
      title: 'text-green-800',
      text: 'text-green-700',
      iconComponent: CheckCircle,
      defaultTitle: 'Restaurant information saved successfully'
    }
  };

  const colors = variants[variant] || variants.error;
  const IconComponent = colors.iconComponent;
  const alertTitle = title || colors.defaultTitle;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !isVisible) return null;

  return (
    <div 
      className={`relative ${colors.bg} ${colors.border} border-l-4 rounded-md shadow-sm p-4 mb-6
                 transition-all duration-300 ease-in-out transform
                 ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}
    >
      <div className="flex items-start">
        <div className={`${colors.icon} flex-shrink-0 mr-3`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className={`${colors.title} text-sm font-medium mb-1`}>
            {alertTitle}
          </h3>
          <div className={`${colors.text} text-sm`}>
            {message}
          </div>
        </div>
        <button 
          onClick={handleClose}
          className={`${colors.text} ml-4 inline-flex hover:bg-opacity-20 hover:bg-gray-200 p-1 rounded-full`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;