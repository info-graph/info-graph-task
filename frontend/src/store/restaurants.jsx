import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basicInfo: {
    name: '',
    phone: '',
    streetName: '',
    openingTime: '08:00',
    closingTime: '22:00',
    landmarks: []
  },
  menuItems: [],
  maintenance: {
    startDate: '',
    endDate: '',
    impactLevel: '',
    cost: '',
    comments: ''
  },
  errors: {},
  loading: false,
  errorMessage: null,
  toast: {
    visible: false,
    message: '',
    type: 'success', 
    title: '',
    duration: 100000, 
    data: null, 
  },
  isVisaible:false
};


const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    updateBasicInfo: (state, action) => {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
    },
    updateMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    updateMaintenance: (state, action) => {
      state.maintenance = { ...state.maintenance, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    showToast: (state, action) => {
      state.toast = {
        ...state.toast,
        visible: true,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
    setOverlay:(state, action)=>{
      state.isVisaible=action.payload
    },
    resetForm: () => initialState
  },

});

export const {
  updateBasicInfo,
  updateMenuItems,
  updateMaintenance,
  setErrors,
  clearErrors,
  resetForm,
  setLoading,
  showToast,
  hideToast,
  setOverlay
} = restaurantSlice.actions;

export const selectRestaurantState = (state) => state.restaurants;
export const selectBasicInfo = (state) => state.restaurant.basicInfo;
export const selectMenuItems = (state) => state.restaurant.menuItems;
export const selectMaintenance = (state) => state.restaurant.maintenance;
export const selectStatus = (state) => state.restaurant.status;
export const selectErrorMessage = (state) => state.restaurant.errorMessage;
export const selectToast = (state) => state.restaurants.toast;

export default restaurantSlice.reducer;