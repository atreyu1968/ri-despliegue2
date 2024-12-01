import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useUsersStore } from '../stores/usersStore';
import { useAuthStore } from '../stores/authStore';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import UserFilters from '../components/users/UserFilters';
import { mockUsers } from '../data/mockUsers';
import type { User, UserRole } from '../types/user';

interface UserFilters {
  role?: UserRole;
  network?: string;
  center?: string;
  search?: string;
}

const Users = () => {
  const {
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
  } = useUsersStore();

  const { user: currentUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});

  useEffect(() => {
    setUsers(mockUsers);
  }, [setUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      deleteUser(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
    } else {
      addUser({ ...data, id: Date.now().toString() });
    }
    setShowForm(false);
    setEditingUser(null);
  };

  // Filter users based on filters and user role
  const filteredUsers = users.filter(user => {
    // Filter by role
    if (filters.role && user.role !== filters.role) return false;

    // Filter by network
    if (filters.network && user.network !== filters.network) return false;

    // Filter by center
    if (filters.center && user.center !== filters.center) return false;

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.medusaCode.toLowerCase().includes(searchTerm)
      );
    }

    // Filter based on user role permissions
    if (currentUser?.role === 'subnet_coordinator') {
      return user.network === currentUser.network;
    }

    if (currentUser?.role === 'manager') {
      return user.center === currentUser.center;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.showModal()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <UserList
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          initialData={editingUser}
        />
      )}

      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        userRole={currentUser?.role}
        userNetwork={currentUser?.network}
      />
    </div>
  );
};

export default Users;