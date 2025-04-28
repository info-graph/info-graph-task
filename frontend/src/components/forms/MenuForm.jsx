import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, AlertTriangle, Check } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';

const MenuForm = ({ menuItems, onChange, onSubmit, isLoading, hasChange }) => {
  const [deletedItemIds, setDeletedItemIds] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [newItem, setNewItem] = useState({
    name: '',
    serving_start_time: '',
    serving_end_time: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => {
        setAlertMessage({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const validateField = (name, value) => {
    if (!value && name !== 'description') {
      return `${name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ')} is required`;
    }
    if (name === 'price' && value && (isNaN(Number(value)) || Number(value) <= 0)) {
      return 'Price must be a positive number';
    }
    return '';
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...menuItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    
    if (formErrors[`${index}_${name}`]) {
      setFormErrors({
        ...formErrors,
        [`${index}_${name}`]: ''
      });
    }
    
    onChange(updatedItems);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
    
    if (formErrors[`new_${name}`]) {
      setFormErrors({
        ...formErrors,
        [`new_${name}`]: ''
      });
    }
  };

  const validateNewItem = () => {
    const errors = {};
    let isValid = true;
    
    ['name', 'serving_start_time', 'serving_end_time', 'price'].forEach(field => {
      const error = validateField(field, newItem[field]);
      if (error) {
        errors[`new_${field}`] = error;
        isValid = false;
      }
    });
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const addNewItem = () => {
    if (!validateNewItem()) {
      setAlertMessage({
        type: 'error',
        message: 'Please fill in all required fields correctly'
      });
      return;
    }
    
    onChange([...menuItems, newItem]);
    
    setAlertMessage({
      type: 'success',
      message: 'Menu item added successfully'
    });
    
    setNewItem({
      name: '',
      serving_start_time: '',
      serving_end_time: '',
      price: '',
      description: ''
    });
  };

  const removeMenuItem = (index) => {
    const itemToRemove = menuItems[index];
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1);
    onChange(updatedItems);

    if (itemToRemove.id) {
      setDeletedItemIds([...deletedItemIds, itemToRemove.id]);
    }
    
    setAlertMessage({
      type: 'success',
      message: 'Menu item removed'
    });
  };

  const validateMenuItems = () => {
    const errors = {};
    let isValid = true;
    
    menuItems.forEach((item, index) => {
      ['name', 'serving_start_time', 'serving_end_time', 'price'].forEach(field => {
        const error = validateField(field, item[field]);
        if (error) {
          errors[`${index}_${field}`] = error;
          isValid = false;
        }
      });
    });
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const hasNewItemData = () => {
    return newItem.name || newItem.price || newItem.serving_start_time || newItem.serving_end_time || newItem.description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasNewItemData()) {
      if (validateNewItem()) {
        onChange([...menuItems, { ...newItem }]);
        
        setNewItem({
          name: '',
          serving_start_time: '',
          serving_end_time: '',
          price: '',
          description: ''
        });
      } else {
        setAlertMessage({
          type: 'error',
          message: 'Please complete the new menu item form or clear it before saving'
        });
        return;
      }
    }
    
    if (!validateMenuItems()) {
      setAlertMessage({
        type: 'error',
        message: 'Please correct the errors before saving'
      });
      return;
    }
    
    try {
      const result = await onSubmit(e, deletedItemIds);
      
      if (result) {
        setAlertMessage({
          type: 'success',
          message: 'Menu items saved successfully'
        });
        
        setDeletedItemIds([]);
      } else {
        setAlertMessage({
          type: 'error',
          message: 'Failed to save menu items'
        });
      }
    } catch (error) {
      setAlertMessage({
        type: 'error',
        message: 'An error occurred while saving menu items'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary font-serif">Menu Items</h2>
        <Button
          type="submit"
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          disabled={!hasChange}
          className={`transition-transform duration-300 ${hasChange ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}          
        >
          Save Menu Items
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">Add or edit menu items for this restaurant</p>
      
      {alertMessage.message && (
        <div className={`flex items-center p-3 rounded-md text-sm transition-all duration-300 animate-fadeIn ${
          alertMessage.type === 'success' 
            ? 'bg-accent bg-opacity-10 border border-accent text-accent' 
            : 'bg-red-50 border border-danger text-danger'
        }`}>
          {alertMessage.type === 'success' 
            ? <Check className="h-4 w-4 mr-2 text-accent" /> 
            : <AlertTriangle className="h-4 w-4 mr-2 text-danger" />
          }
          {alertMessage.message}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-medium mb-3 font-serif">Current Menu Items</h3>
        {menuItems && menuItems?.length > 0 ? (
          <div className={`space-y-4 ${menuItems?.length > 1 ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {menuItems?.map((item, index) => (
              <div 
                key={item.id || index} 
                className="border rounded-lg p-4 hover:border-primary transition-all duration-300 transform hover:scale-[1.01] card-hover bg-white animate-slideIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-primary">{item.name || `Menu Item ${index + 1}`}</h3>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeMenuItem(index)}
                    icon={<Trash2 className="h-4 w-4" />}
                    size="sm"
                    className="hover:scale-105"
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Item Name"
                    id={`item-name-${index}`}
                    name="name"
                    value={item.name || ''}
                    onChange={(e) => handleChange(e, index)}
                    required
                    error={formErrors[`${index}_name`]}
                  />
                  
                  <FormInput
                    label="Price ($)"
                    id={`item-price-${index}`}
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price || ''}
                    onChange={(e) => handleChange(e, index)}
                    required
                    error={formErrors[`${index}_price`]}
                  />
                  
                  <FormInput
                    label="Serving Start Time"
                    id={`start-time-${index}`}
                    name="serving_start_time"
                    type="time"
                    value={item.serving_start_time || ''}
                    onChange={(e) => handleChange(e, index)}
                    required
                    error={formErrors[`${index}_serving_start_time`]}
                  />
                  
                  <FormInput
                    label="Serving End Time"
                    id={`end-time-${index}`}
                    name="serving_end_time"
                    type="time"
                    value={item.serving_end_time || ''}
                    onChange={(e) => handleChange(e, index)}
                    required
                    error={formErrors[`${index}_serving_end_time`]}
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      id={`item-description-${index}`}
                      name="description"
                      value={item.description || ''}
                      onChange={(e) => handleChange(e, index)}
                      rows="2"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="Add a description of this menu item..."
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center animate-fadeIn">
            <p className="text-gray-500">No menu items added yet. Add your menu items below.</p>
          </div>
        )}
      </div>
      
      <div className="border-t pt-6 animate-fadeIn">
        <h3 className="font-medium mb-4 font-serif">Add New Menu Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-light-primary p-4 rounded-md transition-all duration-300">
          <FormInput
            label="Item Name"
            id="new-item-name"
            name="name"
            value={newItem.name}
            onChange={handleNewItemChange}
            error={formErrors[`new_name`]}
          />
          
          <FormInput
            label="Price ($)"
            id="new-item-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={newItem.price}
            onChange={handleNewItemChange}
            error={formErrors[`new_price`]}
          />
          
          <FormInput
            label="Serving Start Time"
            id="new-start-time"
            name="serving_start_time"
            type="time"
            value={newItem.serving_start_time}
            onChange={handleNewItemChange}
            error={formErrors[`new_serving_start_time`]}
          />
          
          <FormInput
            label="Serving End Time"
            id="new-end-time"
            name="serving_end_time"
            type="time"
            value={newItem.serving_end_time}
            onChange={handleNewItemChange}
            error={formErrors[`new_serving_end_time`]}
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="new-item-description"
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
              rows="2"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-primary focus:border-primary transition-all duration-200"
              placeholder="Add a description of this menu item..."
            ></textarea>
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={addNewItem}
              icon={<Plus className="h-4 w-4" />}
              className="transform hover:scale-105"
            >
              Add Another Menu Item
            </Button>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">You can also directly click "Save Menu Items" to add and save in one step</p>
          </div>
        </div>
      </div>
      
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </form>
  );
};

export default MenuForm;