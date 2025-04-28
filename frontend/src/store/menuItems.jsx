import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchAllMenuItems = createAsyncThunk(
  'menuItems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch menu items');
    }
  }
);

export const fetchMenuItemsByRestaurant = createAsyncThunk(
  'menuItems/fetchByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/restaurants/${restaurantId}/menu-items`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant menu items');
    }
  }
);

export const fetchMenuItemById = createAsyncThunk(
  'menuItems/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch menu item');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menuItems/create',
  async (menuItemData, { rejectWithValue }) => {
    try {
      

      if (!menuItemData.restaurant_id) {
        return rejectWithValue('A restaurant must be created before adding menu items');
      }
      
      const response = await axios.post(`${API_URL}/api/menu-items`, menuItemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menuItems/update',
  async ({ id, menuItemData }, { rejectWithValue }) => {
    try {

      const response = await axios.put(`${API_URL}/api/menu-items/${id}`, menuItemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menuItems/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/menu-items/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete menu item');
    }
  }
);

const initialState = {
  menuItems: [],
  currentMenuItem: null,
  restaurantMenuItems: [],
  loading: false,
  error: null,
  success: false
};

const menuItemSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    resetMenuItemState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentMenuItem: (state) => {
      state.currentMenuItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchAllMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(fetchMenuItemsByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItemsByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantMenuItems = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchMenuItemsByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(fetchMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMenuItem = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems.push(action.payload.data);
        
        if (state.restaurantMenuItems.length > 0 && 
            state.restaurantMenuItems[0].restaurant_id === action.payload.data.restaurant_id) {
          state.restaurantMenuItems.push(action.payload.data);
        }
        
        state.success = action.payload.success;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.data;
        
        const menuItemIndex = state.menuItems.findIndex(item => item.id === updatedData.id);
        if (menuItemIndex !== -1) {
          state.menuItems[menuItemIndex] = updatedData;
        }
        
        const restaurantMenuItemIndex = state.restaurantMenuItems.findIndex(
          item => item.id === updatedData.id
        );
        if (restaurantMenuItemIndex !== -1) {
          if (state.restaurantMenuItems[restaurantMenuItemIndex].restaurant_id !== updatedData.restaurant_id) {
            state.restaurantMenuItems = state.restaurantMenuItems.filter(
              item => item.id !== updatedData.id
            );
          } else {
            state.restaurantMenuItems[restaurantMenuItemIndex] = updatedData;
          }
        }
        
        if (state.currentMenuItem && state.currentMenuItem.id === updatedData.id) {
          state.currentMenuItem = updatedData;
        }
        
        state.success = action.payload.success;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        
        state.menuItems = state.menuItems.filter(
          item => item.id !== action.payload.id
        );
        
        state.restaurantMenuItems = state.restaurantMenuItems.filter(
          item => item.id !== action.payload.id
        );
        
        if (state.currentMenuItem && state.currentMenuItem.id === action.payload.id) {
          state.currentMenuItem = null;
        }
        
        state.success = action.payload.success;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { resetMenuItemState, clearCurrentMenuItem } = menuItemSlice.actions;
export default menuItemSlice.reducer;