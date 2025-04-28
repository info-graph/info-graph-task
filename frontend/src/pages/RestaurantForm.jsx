import { useParams, useNavigate } from 'react-router-dom';
import { Info, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import BasicInfoForm from '../components/forms/BasicInfoForm';
import MenuForm from '../components/forms/MenuForm';
import MaintenanceForm from '../components/forms/MaintenanceForm';
import { useRestaurantForm } from '../hooks/RestaurantHook';

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    isEditMode,
    isLoading,
    errorMessage,
    basicInfo,
    menuItems,
    maintenance,
    handleSubmitBasicInfo,
    handleSubmitMenuItems,
    handleSubmitMaintenance,
    handleBasicInfoChange,
    handleMenuItemsChange,
    handleMaintenanceChange,
    hasBasicInfoChanged,
    hasMaintenanceChanged,
    hasMenuItemsChanged
  } = useRestaurantForm(id);

  const isDataReady = !isEditMode || (
    basicInfo && 
    menuItems && 
    maintenance && 
    !isLoading
  );
 
  const formTabs = isEditMode ? [
    {
      id: 'basic',
      label: 'Basic Information',
      content: isDataReady ? (
        <BasicInfoForm 
          formData={basicInfo} 
          onChange={handleBasicInfoChange} 
          onSubmit={handleSubmitBasicInfo}
          isLoading={isLoading}
          navigate={navigate}
          hasChange={hasBasicInfoChanged()}
        />
      ) : null
    },
    {
      id: 'menu',
      label: 'Menu Details',
      content: isDataReady ? (
        <MenuForm 
          menuItems={menuItems || []} 
          onChange={handleMenuItemsChange} 
          onSubmit={handleSubmitMenuItems}
          isLoading={isLoading}
          hasChange={hasMenuItemsChanged()}
        />
      ) : null
    },
    {
      id: 'maintenance',
      label: 'Maintenance History',
      content: isDataReady ? (
        <MaintenanceForm 
          formData={maintenance} 
          onChange={handleMaintenanceChange} 
          onSubmit={handleSubmitMaintenance}
          isLoading={isLoading}
          hasChange={hasMaintenanceChanged()}
        />
      ) : null
    }
  ] : [
    {
      id: 'basic',
      label: 'Basic Information',
      content: (
        <BasicInfoForm 
          formData={basicInfo || {
            name: '',
            phone: '',
            streetName: '',
            openingTime: '08:00',
            closingTime: '22:00',
            landmarks: []
          }} 
          onChange={handleBasicInfoChange} 
          onSubmit={handleSubmitBasicInfo}
          isLoading={isLoading}
        />
      )
    }
  ];
  
  return (
    <div className="page-container animate-fadeIn">
      <h1 className="text-2xl font-bold text-primary mb-6 font-serif">
        {isEditMode ? 'Edit Restaurant' : 'Add New Restaurant'}
      </h1>
      
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-danger rounded-md p-4 flex items-start animate-fadeIn">
          <AlertTriangle className="h-5 w-5 text-danger mt-0.5 mr-2" />
          <div>
            <p className="text-sm font-medium text-danger">There was an error</p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
      
      {isLoading && !isDataReady ? (
        <div className="text-center py-10 animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading restaurant data...</p>
        </div>
      ) : (
        <Card className="card-hover">
          {!isEditMode && (
            <div className="px-6 pt-6 animate-slideIn">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start">
                <Info className="h-5 w-5 text-primary mt-0.5 mr-2" />
                <p className="text-sm text-primary">
                  Menu items and maintenance records can be added after creating the restaurant.
                </p>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <Tabs tabs={formTabs} defaultTab="basic" />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              * Required fields
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RestaurantForm;