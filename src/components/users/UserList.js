import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import AppHeader from '../common/AppHeader';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter || undefined
      };
      
      const response = await userService.getUsers(params);
      
      if (response.data.status) {
        let filteredUsers = response.data.data;
        
        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter(user => {
            const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
            return fullName.includes(term) || 
                   user.email?.toLowerCase().includes(term);
          });
        }
        
        // Apply pagination
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
        setTotalUsers(filteredUsers.length);
        setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await userService.changeStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus === 1 }
          : user
      ));
      
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleAddUser = () => {
    navigate('/users/add');
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <AppHeader  />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={handleAddUser}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add User
        </button>
      </div>

      <UserFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalUsers}
            itemsPerPage={usersPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default UserList;