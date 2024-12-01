import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AcademicYearCard from '../components/academic-years/AcademicYearCard';
import AcademicYearForm from '../components/academic-years/AcademicYearForm';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { mockAcademicYears } from '../data/mockAcademicYears';
import type { AcademicYear, AcademicYearFormData } from '../types/academicYear';

const AcademicYears = () => {
  const { years, setYears, updateYear } = useAcademicYearStore();
  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  useEffect(() => {
    // Initialize with mock data
    setYears(mockAcademicYears);
  }, [setYears]);

  const handleCreateYear = (data: AcademicYearFormData) => {
    const newYear: AcademicYear = {
      ...data,
      id: Date.now().toString(),
      quarters: [
        {
          id: `${Date.now()}-1`,
          name: 'Primer Trimestre',
          startDate: data.startDate,
          endDate: new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 3)).toISOString().split('T')[0],
          isActive: false,
        },
        {
          id: `${Date.now()}-2`,
          name: 'Segundo Trimestre',
          startDate: new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 4)).toISOString().split('T')[0],
          endDate: new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 7)).toISOString().split('T')[0],
          isActive: false,
        },
        {
          id: `${Date.now()}-3`,
          name: 'Tercer Trimestre',
          startDate: new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 8)).toISOString().split('T')[0],
          endDate: data.endDate,
          isActive: false,
        },
      ],
    };
    
    if (data.isActive) {
      // Deactivate other years if this one is active
      setYears([
        ...years.map(year => ({ ...year, isActive: false })),
        newYear
      ]);
    } else {
      setYears([...years, newYear]);
    }
    setShowForm(false);
  };

  const handleEditYear = (year: AcademicYear) => {
    setEditingYear(year);
    setShowForm(true);
  };

  const handleUpdateYear = (data: AcademicYearFormData) => {
    if (!editingYear) return;

    const updatedYear = { ...editingYear, ...data };
    
    if (data.isActive) {
      // Deactivate other years if this one is active
      setYears(
        years.map(year =>
          year.id === editingYear.id ? updatedYear : { ...year, isActive: false }
        )
      );
    } else {
      updateYear(updatedYear);
    }
    
    setShowForm(false);
    setEditingYear(null);
  };

  const handleToggleQuarter = (yearId: string, quarterId: string) => {
    const year = years.find(y => y.id === yearId);
    if (!year) return;

    const updatedYear = {
      ...year,
      quarters: year.quarters.map(quarter =>
        quarter.id === quarterId
          ? { ...quarter, isActive: !quarter.isActive }
          : quarter
      ),
    };

    updateYear(updatedYear);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Cursos Académicos
        </h1>
        <button
          onClick={() => {
            setEditingYear(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Curso</span>
        </button>
      </div>

      <div className="space-y-4">
        {years.map((year) => (
          <AcademicYearCard
            key={year.id}
            academicYear={year}
            onEdit={handleEditYear}
            onToggleQuarter={handleToggleQuarter}
          />
        ))}
      </div>

      {showForm && (
        <AcademicYearForm
          onSubmit={editingYear ? handleUpdateYear : handleCreateYear}
          onClose={() => {
            setShowForm(false);
            setEditingYear(null);
          }}
          initialData={editingYear || undefined}
        />
      )}
    </div>
  );
};

export default AcademicYears;