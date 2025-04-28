import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateBasicInfo,
  updateMenuItems,
  updateMaintenance,
  setErrors,
  resetForm,
  selectRestaurantState,
  selectStatus,
  selectErrorMessage,
  setLoading
} from '../store/restaurants';
import { useToast } from './useToast';


import {
  fetchRestaurantWithRelations,
  createRestaurant,
  updateRestaurant
} from '../store/restaurant';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../store/menuItems';
import { createMaintenance, updateMaintenanceRecords } from '../store/maintenance';
import { delay } from '../helper/delay';

export const useRestaurantForm = (restaurantId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(restaurantId);
  const toast = useToast();

  const restaurant = useSelector(selectRestaurantState);
  const status = useSelector(selectStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const [originalBasicInfo, setOriginalBasicInfo] = useState(null);
  const [originalMenuItems, setOriginalMenuItems] = useState(null);
  const [originalMaintenance, setOriginalMaintenance] = useState(null);

  useEffect(() => {
    dispatch(setLoading(true));
    if (isEditMode) {
      dispatch(fetchRestaurantWithRelations(restaurantId))
        .then((resultAction) => {
          if (resultAction.meta.requestStatus === 'fulfilled') {
            const restaurantData = resultAction.payload.data;

            const basicInfoData = {
              name: restaurantData.name || '',
              phone: restaurantData.phone || '',
              streetName: restaurantData.streetName || '',
              openingTime: restaurantData.openingTime || '08:00',
              closingTime: restaurantData.closingTime || '22:00',
              landmarks: restaurantData.landmarks || [],
              latitude: restaurantData.latitude || null,
              longitude: restaurantData.longitude || null
            };

            dispatch(updateBasicInfo(basicInfoData));
            setOriginalBasicInfo(JSON.stringify(basicInfoData));

            let menuItemsData = [];
            if (restaurantData.menuItems && restaurantData.menuItems.length > 0) {
              menuItemsData = restaurantData.menuItems.map(item => ({
                id: item.id,
                name: item.name,
                serving_start_time: item.serving_start_time,
                serving_end_time: item.serving_end_time,
                price: item.price,
                description: item.description || '',
                restaurant_id: restaurantId
              }));
            }

            dispatch(updateMenuItems(menuItemsData));
            setOriginalMenuItems(JSON.stringify(menuItemsData));

            let maintenanceData = {
              startDate: '',
              endDate: '',
              impactLevel: 'normal',
              cost: '',
              comments: '',
              restaurant_id: restaurantId
            };

            if (restaurantData.maintenanceRecords && restaurantData.maintenanceRecords.length > 0) {
              const latestRecord = restaurantData.maintenanceRecords[0];
              maintenanceData = {
                id: latestRecord.id,
                startDate: latestRecord.startDate || '',
                endDate: latestRecord.endDate || '',
                impactLevel: latestRecord.impactLevel || 'normal',
                cost: latestRecord.cost || '',
                comments: latestRecord.comments || '',
                restaurant_id: restaurantId
              };
            }
            console.log("maintenanceData>>>", maintenanceData)
            dispatch(updateMaintenance(maintenanceData));
            setOriginalMaintenance(JSON.stringify(maintenanceData));
          }
           delay(Date.now())
          dispatch(setLoading(false));
        })
        .catch(error => {
          console.error("Error loading restaurant data:", error);
          dispatch(setLoading(false));
        });
    } else {
      dispatch(resetForm());
      setOriginalBasicInfo(null);
      setOriginalMenuItems(null);
      setOriginalMaintenance(null);
    }

    return () => {
      dispatch(resetForm());
      setOriginalBasicInfo(null);
      setOriginalMenuItems(null);
      setOriginalMaintenance(null);
    };
  }, [dispatch, restaurantId, isEditMode]);

  const hasBasicInfoChanged = () => {
    if (!originalBasicInfo || !isEditMode) return false;
    return JSON.stringify(restaurant.basicInfo) !== originalBasicInfo;
  };

  const hasMenuItemsChanged = () => {
    if (!originalMenuItems || !isEditMode) return false;
    return JSON.stringify(restaurant.menuItems) !== originalMenuItems;
  };

  const hasMaintenanceChanged = () => {
    if (!originalMaintenance || !isEditMode) return false;
    return JSON.stringify(restaurant.maintenance) !== originalMaintenance;
  };

  const handleSubmitBasicInfo = async (e) => {
    e.preventDefault();
    let resultAction;

    if (isEditMode) {
      dispatch(setLoading(true));
      resultAction = await dispatch(updateRestaurant({
        id: restaurantId,
        restaurantData: restaurant.basicInfo
      }))
      await delay(Date.now())
      navigate(`/restaurants`);
      dispatch(setLoading(false));
      toast.delayed().success("Your changes have been saved successfully");

    } else {
      dispatch(setLoading(true));
      resultAction = await dispatch(createRestaurant(restaurant.basicInfo))
      if (resultAction.meta?.requestStatus === 'fulfilled') {
        await delay(Date.now())
        navigate(`/restaurants`);

        dispatch(setLoading(false))
        toast.delayed().success("Your changes have been saved successfully");
        return true;
      }
      else {
        dispatch(setLoading(false));
      }
    }

    return resultAction.meta.requestStatus === 'fulfilled';
  };

  const handleSubmitMenuItems = async (e, deletedItemIds = []) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!isEditMode) {
      dispatch(setErrors({
        menuItems: 'Menu items can only be added after creating the restaurant'
      }));
      return false;
    }

    if (deletedItemIds.length > 0) {
      const deletePromises = deletedItemIds.map(id => dispatch(deleteMenuItem(id)));
      await Promise.all(deletePromises);
    }

    const results = await Promise.all(
      restaurant.menuItems.map(async (item) => {
        const menuItemData = {
          name: item.name,
          serving_start_time: item.serving_start_time,
          serving_end_time: item.serving_end_time,
          price: item.price,
          description: item.description || '',
          restaurant_id: restaurantId
        };

        const action = item.id
          ? updateMenuItem({ id: item.id, menuItemData })
          : createMenuItem(menuItemData);

        return await dispatch(action);
      })

    );

    const allSuccessful = results.every(result => result.meta.requestStatus === 'fulfilled');
    if (allSuccessful) {
      await delay(Date.now());
      dispatch(setLoading(false));
      navigate(`/restaurants`);
      toast.delayed().success("Your changes have been saved successfully");
    }
    else {
      dispatch(setLoading(false));
    }
    return allSuccessful;
  };

  const handleSubmitMaintenance = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!isEditMode) {
      dispatch(setErrors({
        maintenance: 'Maintenance records can only be added after creating the restaurant'
      }));
      return false;
    }

    let resultAction;

    if (restaurant.maintenance.id && restaurant.maintenance.id !== undefined) {
      resultAction = await dispatch(updateMaintenanceRecords({
        id: restaurant.maintenance.id,
        maintenanceData: { ...restaurant.maintenance, restaurant_id: restaurantId }
      }));
      if (resultAction.meta?.requestStatus === 'fulfilled') {
        await delay(Date.now())
        dispatch(setLoading(false));
        navigate(`/restaurants`);
        toast.delayed().success("Your changes have been saved successfully");
      }

    } else {
      resultAction = await dispatch(createMaintenance({
        ...restaurant.maintenance,
        restaurant_id: restaurantId
      }));
      if (resultAction.meta?.requestStatus === 'fulfilled') {
        await delay(Date.now())
        dispatch(setLoading(false));
        navigate(`/restaurants`);
        toast.delayed().success("Your changes have been saved successfully");
      }
    }
    await delay(Date.now())
    dispatch(setLoading(false));
    return resultAction.meta.requestStatus === 'fulfilled';
  };

  const handleBasicInfoChange = (data) => {
    dispatch(updateBasicInfo(data));
  };

  const handleMenuItemsChange = (data) => {
    if (isEditMode) {
      dispatch(updateMenuItems(data));
    } else {
      dispatch(setErrors({
        menuItems: 'Menu items can only be added after creating the restaurant'
      }));
    }
  };

  const handleMaintenanceChange = (data) => {
    if (isEditMode) {
      dispatch(updateMaintenance(data));
    } else {
      dispatch(setErrors({
        maintenance: 'Maintenance records can only be added after creating the restaurant'
      }));
    }
  };



  return {
    isEditMode,
    isLoading: status === 'loading',
    errorMessage,
    basicInfo: restaurant.basicInfo,
    menuItems: restaurant.menuItems,
    maintenance: restaurant.maintenance,
    handleSubmitBasicInfo,
    handleSubmitMenuItems,
    handleSubmitMaintenance,
    handleBasicInfoChange,
    handleMenuItemsChange,
    handleMaintenanceChange,
    hasBasicInfoChanged,
    hasMenuItemsChanged,
    hasMaintenanceChanged
  };
};