import { useState } from 'react';
import { Calendar, DollarSign, Save } from 'lucide-react';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import Button from '../ui/Button';
import ErrorAlert from '../ui/ErrorAlert';

const MaintenanceForm = ({ formData, onChange, onSubmit, isLoading, hasChange }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: null, message: null, title: null });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const getFormattedFormData = () => ({
    startDate: formatDateForInput(formData?.startDate) || '',
    endDate: formatDateForInput(formData?.endDate) || '',
    impactLevel: formData?.impactLevel || 'normal',
    cost: formData?.cost || '',
    comments: formData?.comments || '',
    id: formData?.id,
    restaurant_id: formData?.restaurant_id
  });

  const validateField = (name, value) => {
    const formattedData = getFormattedFormData();

    switch (name) {
      case 'startDate':
        return !value ? 'Start date is required' : '';
      case 'endDate':
        if (!value) return 'End date is required';
        if (formattedData.startDate && new Date(value) < new Date(formattedData.startDate)) {
          return 'End date must be after start date';
        }
        return '';
      case 'impactLevel':
        return !value ? 'Impact level is required' : '';
      case 'cost':
        if (!value && value !== 0) return 'Cost is required';
        if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          return 'Please enter a valid positive number';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const formattedData = getFormattedFormData();
    const errors = {};

    for (const field of ['startDate', 'endDate', 'impactLevel', 'cost']) {
      const error = validateField(field, formattedData[field]);
      if (error) errors[field] = error;
    }

    return errors;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const formattedData = getFormattedFormData();
    const error = validateField(name, formattedData[name]);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value
    };

    onChange(updatedData);

    if (touched[name] || formSubmitted) {
      const error = validateField(name, value);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const errors = validateForm();
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
          message: 'Failed to save maintenance record. Please try again.'
        });
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'An error occurred while saving the maintenance record'
      });
    }
  };


  const impactOptions = [
    { value: 'normal', label: 'Normal Operations' },
    { value: 'partial', label: 'Partial Shutdown' },
    { value: 'complete', label: 'Complete Shutdown' }
  ];

  const errors = { ...validationErrors };

  const formattedData = getFormattedFormData();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {formStatus.message && (
        <ErrorAlert
          message={formStatus.message}
          onClose={() => setFormStatus({ type: null, message: null })}
          variant={formStatus.type}
          title={formStatus.message}
        />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary font-serif">Maintenance History</h2>
        <Button
          type="submit"
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          disabled={!hasChange}
          className={`transition-transform duration-300 ${hasChange ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}          >
          Save Maintenance Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="transition-all duration-300 hover:shadow-md p-2 rounded-md">
          <FormInput
            label="Start Date"
            id="start-date"
            name="startDate"
            type="date"
            value={formattedData.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            icon={<Calendar className="h-4 w-4 text-primary" />}
            error={errors?.startDate}
          />
        </div>

        <div className="transition-all duration-300 hover:shadow-md p-2 rounded-md">
          <FormInput
            label="End Date"
            id="end-date"
            name="endDate"
            type="date"
            value={formattedData.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            icon={<Calendar className="h-4 w-4 text-primary" />}
            error={errors?.endDate}
          />
        </div>

        <div className="transition-all duration-300 hover:shadow-md p-2 rounded-md">
          <FormSelect
            label="Impact Level"
            id="impact-level"
            name="impactLevel"
            value={formattedData.impactLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            options={impactOptions}
            error={errors?.impactLevel}
          />
        </div>

        <div className="transition-all duration-300 hover:shadow-md p-2 rounded-md">
          <FormInput
            label="Maintenance Cost"
            id="cost"
            name="cost"
            type="number"
            value={formattedData.cost}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="0.00"
            min="0"
            step="0.01"
            icon={<DollarSign className="h-4 w-4 text-primary" />}
            error={errors?.cost}
          />
        </div>

        <div className="md:col-span-2 transition-all duration-300 hover:shadow-md p-2 rounded-md">
          <label className="block text-sm font-medium text-primary mb-1 font-serif">
            Comments (Optional)
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formattedData.comments}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300
              ${errors?.comments
                ? 'border-danger focus:ring-danger focus:border-danger'
                : 'border-primary/30 focus:ring-primary focus:border-primary'
              }`
            }
            placeholder="Add any additional notes about the maintenance..."
          ></textarea>
          {errors?.comments && (
            <p className="mt-1 text-sm text-danger animate-fadeIn">{errors?.comments}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default MaintenanceForm;