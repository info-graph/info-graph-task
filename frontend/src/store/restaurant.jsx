import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchAllRestaurants = createAsyncThunk(
  'restaurants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
    }
  }
);

export const fetchRestaurantWithRelations = createAsyncThunk(
  'restaurants/fetchWithRelations',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/restaurants/${id}/with-relations`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant with relations');
    }
  }
);

export const createRestaurant = createAsyncThunk(
  'restaurants/create',
  async (restaurantData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${API_URL}/api/restaurants`, restaurantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create restaurant');
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/update',
  async ({ id, restaurantData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update restaurant');
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/restaurants/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete restaurant');
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  success: false
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    resetRestaurantState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchAllRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(fetchRestaurantWithRelations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantWithRelations.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(fetchRestaurantWithRelations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload.data);
        state.success = action.payload.success;
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.data;

        const index = state.restaurants.findIndex(r => r.id === updatedData.id);
        if (index !== -1) {
          state.restaurants[index] = updatedData;
        }

        if (state.currentRestaurant && state.currentRestaurant.id === updatedData.id) {
          state.currentRestaurant = updatedData;
        }

        state.success = action.payload.success;
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      .addCase(deleteRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = state.restaurants.filter(
          restaurant => restaurant.id !== action.payload.id
        );
        if (state.currentRestaurant && state.currentRestaurant.id === action.payload.id) {
          state.currentRestaurant = null;
        }

        state.success = action.payload.success;
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { resetRestaurantState, clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;