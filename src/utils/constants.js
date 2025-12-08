export const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
export const COMPANY_ID = process.env.REACT_APP_COMPANY_ID || '4';

export const ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'User',
  DESIGNER: 'Designer',
  PROJECT_MANAGER: 'Project Manager'
};

export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE_DIGITS: 'Phone number must contain only digits',
  PHONE_LENGTH: 'Phone number must be 10-15 digits',
  MIN_RESPONSIBILITIES: 'At least one responsibility is required'
};

export const TABLE_COLUMNS = [
  { key: 'sno', label: 'S.No', width: 'w-16' },
  { key: 'name', label: 'Name', width: 'w-1/4' },
  { key: 'email', label: 'Email', width: 'w-1/4' },
  { key: 'initials', label: 'Initials', width: 'w-20' },
  { key: 'phone', label: 'Phone', width: 'w-32' },
  { key: 'role', label: 'Role', width: 'w-32' },
  { key: 'status', label: 'Status', width: 'w-24' },
  { key: 'title', label: 'Title', width: 'w-32' },
  { key: 'actions', label: 'Actions', width: 'w-24' }
];