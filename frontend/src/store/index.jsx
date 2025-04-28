import { configureStore } from "@reduxjs/toolkit";
import maintenance from './maintenance';
import menuItems from './menuItems';
import restaurant from './restaurant'
import restaurants from './restaurants'

const store = configureStore({
    reducer:{
        maintenance,
        menuItems,
        restaurant,
        restaurants
    }
})

export default store;