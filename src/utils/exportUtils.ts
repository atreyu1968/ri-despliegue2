import { utils, writeFile } from 'xlsx';
import type { Action } from '../types/action';
import type { ReportFilters } from '../types/report';
import { useMasterRecordsStore } from '../stores/masterRecordsStore';

export const exportToExcel = async (
  actions: Action[], 
  filters: ReportFilters, 
  filename: string
): Promise<boolean> => {
  try {
    // Get store data for reference lookups
    const { departments, families, objectives } = useMasterRecordsStore.getState();

    // Format data with filter context
    const data = actions.map(action => {
      // Get department names
      const departmentNames = action.departments
        .map(code => departments.find(d => d.code === code)?.name || code)
        .join(', ');

      // Get family names
      const familyNames = action.professionalFamilies
        .map(code => families.find(f => f.code === code)?.name || code)
        .join(', ');

      // Get objective names
      const objectiveNames = action.objectives
        .map(id => objectives.find(o => o.id === id)?.name || id)
        .join(', ');

      return {
        'Nombre': action.name,
        'Ubicación': action.location,
        'Descripción': action.description,
        'Fecha Inicio': action.startDate,
        'Fecha Fin': action.endDate,
        'Red': action.network,
        'Centro': action.center,
        'Trimestre': action.quarter,
        'Departamentos': departmentNames,
        'Familias Profesionales': familyNames,
        'Objetivos': objectiveNames,
        'Estudiantes': action.studentParticipants,
        'Profesores': action.teacherParticipants,
        'Total Participantes': action.studentParticipants + action.teacherParticipants,
        'Valoración': action.rating,
        'Comentarios': action.comments,
      };
    });

    // Create worksheet
    const ws = utils.json_to_sheet(data);

    // Create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Acciones');

    // Auto-size columns
    const maxWidth = 50;
    const wsColWidths = data.reduce((acc: { [key: string]: number }, row) => {
      Object.entries(row).forEach(([key, value], i) => {
        const width = Math.min(maxWidth, Math.max(String(key).length, String(value).length) + 2);
        acc[utils.encode_col(i)] = Math.max(acc[utils.encode_col(i)] || 0, width);
      });
      return acc;
    }, {});

    ws['!cols'] = Object.entries(wsColWidths).map(([, width]) => ({ width }));

    // Write file
    writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};