import { useDispatch } from 'react-redux';
import { showToast } from '../store/restaurants';

export const useToast = () => {
  const dispatch = useDispatch();
  
  const createToast = (type, message, options = {}) => {
    dispatch(showToast({
      type,
      message,
      duration: type === 'error' ? 5000 : 3000,
      ...options,
    }));
  };
  
  const withDelay = (toastFn, delayTime = 2000) => {
    return (...args) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = toastFn(...args);
          resolve(result);
        }, delayTime);
      });
    };
  };
  
  const toast = {
    success: (message, options = {}) => createToast('success', message, options),
    error: (message, options = {}) => createToast('error', message, options),
    warning: (message, options = {}) => createToast('warning', message, options),
    info: (message, options = {}) => createToast('info', message, options),
    delay: (message, options = {}) => createToast('delay', message, options),
    approval: (message, options = {}) => createToast('approval', message, options),
    notification: (message, options = {}) => createToast('notification', message, options),
    
    restaurantAdded: (restaurantName, options = {}) => {
      dispatch(showToast({
        type: 'success',
        data: { 
          restaurantName,
          templateType: 'restaurantAdded'
        },
        duration: 3000,
        ...options,
      }));
    },
    restaurantUpdated: (restaurantName, options = {}) => {
      dispatch(showToast({
        type: 'info',
        data: { 
          restaurantName,
          templateType: 'restaurantUpdated'
        },
        duration: 3000,
        ...options,
      }));
    },
    menuItemAdded: (itemName, options = {}) => {
      dispatch(showToast({
        type: 'success',
        data: { 
          itemName,
          templateType: 'menuItemAdded'
        },
        duration: 3000,
        ...options,
      }));
    },
    maintenanceScheduled: (restaurantName, startDate, endDate, options = {}) => {
      dispatch(showToast({
        type: 'info',
        data: { 
          restaurantName,
          startDate,
          endDate,
          templateType: 'maintenanceScheduled'
        },
        duration: 4000,
        ...options,
      }));
    },
    
    custom: (config) => {
      dispatch(showToast({
        type: 'info',
        duration: 3000,
        ...config
      }));
    },
    
    delayed: (delayTime = 2000) => {
      return {
        success: withDelay(toast.success, delayTime),
        error: withDelay(toast.error, delayTime),
        warning: withDelay(toast.warning, delayTime),
        info: withDelay(toast.info, delayTime),
        approval: withDelay(toast.approval, delayTime),
        notification: withDelay(toast.notification, delayTime),
        restaurantAdded: withDelay(toast.restaurantAdded, delayTime),
        restaurantUpdated: withDelay(toast.restaurantUpdated, delayTime),
        menuItemAdded: withDelay(toast.menuItemAdded, delayTime),
        maintenanceScheduled: withDelay(toast.maintenanceScheduled, delayTime),
        custom: withDelay(toast.custom, delayTime)
      };
    }
  };
  
  return toast;
};