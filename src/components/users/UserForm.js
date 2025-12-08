import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import LoadingSpinner from '../common/LoadingSpinner';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    role: '',
    title: '',
    initials: '',
    phone: '',
    responsibilities: [],
    user_picture: null,
    overwite_data: '0'
  });
  
  const [roles, setRoles] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [emailExists, setEmailExists] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .test('email-check', 'Email validation in progress', function(value) {
        return new Promise((resolve) => {
          if (!value) resolve(true);
          userService.checkEmailExists(value)
            .then(response => {
              setEmailExists(response.data);
              if (response.data.exists && !response.data.can_override && !isEditMode) {
                resolve(this.createError({
                  message: 'Email already exists and cannot be overridden'
                }));
              } else {
                resolve(true);
              }
            })
            .catch(() => resolve(true));
        });
      }),
    role: Yup.string().required('Role is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .nullable(),
    responsibilities: Yup.array()
      .min(1, 'At least one responsibility is required')
      .required('Responsibilities are required')
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roles
        const rolesResponse = await userService.getRoles();
        console.log(rolesResponse,'rolresponse')
        if (rolesResponse.data.status) {
          const roleData = rolesResponse.data.data;
          const allRoles = [
            ...(roleData.other_roles || []),
            { id: roleData.owner, title: 'Owner' },
            { id: roleData.admin, title: 'Admin' }
          ].filter(role => role.id);
          setRoles(allRoles);
        }

        // Fetch responsibilities
        const respResponse = await userService.getResponsibilities();
        if (Array.isArray(respResponse.data)) {
          setResponsibilities(respResponse.data);
        }

        // Fetch user data if in edit mode
        if (isEditMode) {
          const userResponse = await userService.getUser(id);
          if (userResponse.data.status) {
            const user = userResponse.data.data;
            const values = {
              name: user.first_name || '',
              email: user.email || '',
              role: user.role?.id?.toString() || '',
              title: user.title || '',
              initials: user.initials || '',
              phone: user.phone || '',
              responsibilities: user.responsibilities || [],
              user_picture: null,
              overwite_data: '0'
            };
            
            if (user.profile_image_url) {
              setImagePreview(user.profile_image_url);
            }
            
            setInitialValues(values);
          }
        }
      } catch (error) {
        toast.error('Failed to load form data');
        console.error('Error loading form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFieldValue('user_picture', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setFieldValue) => {
    setFieldValue('user_picture', null);
    setImagePreview(null);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setFormLoading(true);
      
      const userData = {
        ...values,
        role: parseInt(values.role),
        overwite_data: emailExists?.can_override ? '1' : '0'
      };

      if (isEditMode) {
        await userService.updateUser(id, userData);
        toast.success('User updated successfully');
      } else {
        await userService.createUser(userData);
        toast.success('User created successfully');
      }
      console.log(handleSubmit,'submittion')
      navigate('/users');
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      }
      
      const errorMsg = error.response?.data?.message || 'Failed to save user';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Users
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-gray-500 mt-2">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex flex-col space-y-2">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Upload Photo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                      </span>
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setFieldValue)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload a profile picture (optional). Recommended size: 300x300 pixels.
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.name && touched.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="Enter full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.email && touched.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="user@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.phone && touched.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="1234567890"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.role && touched.role
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Initials Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initials
                  </label>
                  <Field
                    type="text"
                    name="initials"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., JD"
                    maxLength="5"
                  />
                  <p className="mt-1 text-xs text-gray-500">Maximum 5 characters</p>
                </div>
              </div>

              {/* Responsibilities Field - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {responsibilities.map((resp) => (
                    <label
                      key={resp.id}
                      className={`inline-flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        values.responsibilities.includes(resp.id.toString())
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <Field
                        type="checkbox"
                        name="responsibilities"
                        value={resp.id.toString()}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{resp.title}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name="responsibilities"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
                {responsibilities.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">No responsibilities available</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formLoading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting || formLoading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {formLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      Saving...
                    </span>
                  ) : (
                    'Save User'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserForm;