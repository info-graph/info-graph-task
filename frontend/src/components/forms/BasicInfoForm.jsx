import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MapPin, Clock, X, Plus, Save } from 'lucide-react';
import FormInput from '../ui/FormInput';
import Button from '../ui/Button';
import MapSelector from './MapSelector';
import ErrorAlert from '../ui/ErrorAlert';
import { setOverlay } from '../../store/restaurants';

const BasicInfoForm = ({ formData, onChange, onSubmit, isLoading, hasChange }) => {
  const [newLandmark, setNewLandmark] = useState('');
  const [showMap, setShowMap] = useState(false);
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [formStatus, setFormStatus] = useState({ type: null, message: null, title: null });

  const safeFormData = useMemo(() => {
    return formData || {
      name: '',
      phone: '',
      streetName: '',
      openingTime: '08:00',
      closingTime: '22:00',
      landmarks: [],
      latitude: null,
      longitude: null
    };
  }, [formData]);


  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Restaurant name is required' : '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        return !/^[\d\s()+-]+$/.test(value) ? 'Please enter a valid phone number' : '';
      case 'streetName':
        return !value.trim() ? 'Street name is required' : '';
      case 'openingTime':
        return !value ? 'Opening time is required' : '';
      case 'closingTime':
        return !value ? 'Closing time is required' : '';
      default:
        return '';
    }
  };

  const validateForm = (data) => {
    const errors = {};

    for (const field of ['name', 'phone', 'streetName', 'openingTime', 'closingTime']) {
      const error = validateField(field, data[field]);
      if (error) errors[field] = error;
    }

    return errors;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, safeFormData[name]);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...safeFormData, [name]: value };
    onChange(updatedData);

    if (touched[name] || formSubmitted) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    if (submissionError) {
      setSubmissionError(null);
    }
  };

  const handleObjectChange = (updatedData) => {
    onChange(updatedData);

    if (formSubmitted) {
      const errors = validateForm(updatedData);
      setValidationErrors(errors);
    }

    if (submissionError) {
      setSubmissionError(null);
    }
  };

  const addLandmark = () => {
    if (newLandmark.trim()) {
      const updatedData = {
        ...safeFormData,
        landmarks: [...(safeFormData.landmarks || []), newLandmark.trim()]
      };
      handleObjectChange(updatedData);
      setNewLandmark('');
    }
  };

  const removeLandmark = (index) => {
    const updatedLandmarks = [...(safeFormData.landmarks || [])];
    updatedLandmarks.splice(index, 1);
    handleObjectChange({
      ...safeFormData,
      landmarks: updatedLandmarks
    });
  };

  const handleMapSelection = ({ latitude, longitude, address }) => {
    let updatedStreetName = safeFormData.streetName;

    if (!safeFormData.streetName.trim() ||
      window.confirm('Do you want to update the street name with the selected address?')) {
      updatedStreetName = address;
    }

    handleObjectChange({
      ...safeFormData,
      latitude,
      longitude,
      streetName: updatedStreetName
    });

    setShowMap(false);
    dispatch(setOverlay(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const errors = validateForm(safeFormData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormStatus({
        type: 'error',
        message: 'Please fill all required fields correctly.'
      });
      return;
    }

    setFormStatus({ type: null, message: null });

    try {
      const result = await onSubmit(e);

      if (!result) {
        setFormStatus({
          type: 'error',
          message: 'Failed to save restaurant information. Please try again.'
        });
      }

    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'An error occurred while saving the restaurant information'
      });
    }
  };

  const errors = { ...validationErrors };

  useEffect(() => {
    if (submissionError) {
      setSubmissionError(null);
    }
  }, [safeFormData, submissionError]);

  const handleShow = () => {
    setShowMap(true);
    dispatch(setOverlay(true));
  };

  const handleHidden = () => {
    setShowMap(false);
    dispatch(setOverlay(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-primary font-serif mb-4">Restaurant Information</h2>

        {formStatus.message && (
          <ErrorAlert
            message={formStatus.message}
            onClose={() => setFormStatus({ type: null, message: null })}
            variant={formStatus.type}
            title={formStatus.message}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Restaurant Name"
            id="restaurant-name"
            name="name"
            value={safeFormData.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Restaurant Name"
            error={errors?.name}
          />

          <FormInput
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            value={safeFormData.phone || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="(123) 456-7890"
            error={errors?.phone}
          />

          <div className="md:col-span-2 transition-all duration-300 hover:shadow-md rounded-md">
            <FormInput
              label="Street Name"
              id="street-name"
              name="streetName"
              value={safeFormData.streetName || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="123 Main Street"
              error={errors?.streetName}
            />
          </div>

          <FormInput
            label="Opening Time"
            id="opening-time"
            name="openingTime"
            type="time"
            value={safeFormData.openingTime || '08:00'}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            icon={<Clock className="h-4 w-4 text-primary" />}
            error={errors?.openingTime}
          />

          <FormInput
            label="Closing Time"
            id="closing-time"
            name="closingTime"
            type="time"
            value={safeFormData.closingTime || '22:00'}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            icon={<Clock className="h-4 w-4 text-primary" />}
            error={errors?.closingTime}
          />
        </div>

        <div className="border-t border-primary/20 pt-4 transition-all duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-primary font-serif">Location</h3>
            <Button
              type="button"
              variant="secondary"
              icon={<MapPin className="h-4 w-4 text-accent" />}
              onClick={() => handleShow()}
              className="transition-transform duration-300 hover:scale-105"
            >
              Select Location on Map
            </Button>
          </div>

          {safeFormData.latitude && safeFormData.longitude && (
            <div className="bg-light-primary p-3 rounded-md transition-all duration-300 animate-fadeIn shadow-sm">
              <p className="text-sm text-primary">
                Selected coordinates: {parseFloat(safeFormData.latitude).toFixed(6)}, {parseFloat(safeFormData.longitude).toFixed(6)}
              </p>
            </div>
          )}

          {errors?.latitude && (
            <p className="mt-1 text-sm text-danger animate-fadeIn">{errors.latitude}</p>
          )}
        </div>

        <div className="transition-all duration-300 hover:shadow-sm p-4 rounded-md">
          <label className="block text-sm font-medium text-primary mb-1">Nearby Landmarks</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newLandmark}
              onChange={(e) => setNewLandmark(e.target.value)}
              className="flex-1 px-4 py-2 border border-primary/30 rounded-md focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="Add a nearby landmark"
            />
            <Button
              type="button"
              onClick={addLandmark}
              icon={<Plus className="h-4 w-4" />}
            >
              Add
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(safeFormData.landmarks || []).map((landmark, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-light-primary text-primary rounded-full pl-3 pr-2 py-1 text-sm transition-all duration-300 hover:bg-primary hover:text-white"
              >
                {landmark}
                <button
                  type="button"
                  onClick={() => removeLandmark(index)}
                  className="ml-1 rounded-full hover:bg-dark-primary hover:text-white p-1 transition-colors duration-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          {errors && errors?.landmarks && (
            <p className="mt-1 text-sm text-danger animate-fadeIn">{errors?.landmarks}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            icon={<Save className="h-4 w-4" />}
            disabled={!hasChange && !location.pathname.includes('/new')}
            className={`transition-transform duration-300 ${hasChange || location.pathname.includes('/new')
                ? 'hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
              }`}
          >
            {isLoading ? 'Saving...' : 'Save Restaurant Information'}
          </Button>
        </div>

      </form>
      <div className='z-'>
        {showMap && (
          <MapSelector
            initialLatitude={safeFormData.latitude}
            initialLongitude={safeFormData.longitude}
            onSave={handleMapSelection}
            onCancel={() => handleHidden()}
          />
        )}
      </div>
    </>
  );
};

export default BasicInfoForm;