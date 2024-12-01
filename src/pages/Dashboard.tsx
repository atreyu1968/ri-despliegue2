import React from 'react';
import { useAuthStore } from '../stores/authStore';
import Calendar from '../components/dashboard/Calendar';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Bienvenido, {user?.name}
            </h2>
            <p className="text-gray-600">
              Panel de control de la Red de Innovación FP
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Centros Activos</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Acciones Registradas</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Participantes</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;