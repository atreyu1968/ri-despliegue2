import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Action } from '../types/action';
import type { ReportFilters } from '../types/report';
import { useMasterRecordsStore } from '../stores/masterRecordsStore';
import { useAuthStore } from '../stores/authStore';
import { useAcademicYearStore } from '../stores/academicYearStore';

export const generatePDF = async (
  actions: Action[],
  filters: ReportFilters,
  chartImages: { [key: string]: string }
) => {
  const { departments, families, objectives, networks, ods } = useMasterRecordsStore.getState();
  const { user } = useAuthStore.getState();
  const { activeYear } = useAcademicYearStore.getState();

  // Create PDF in landscape mode with larger margins
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 25; // Increased margin

  // Add logo with better sizing
  doc.addImage(
    'https://i.postimg.cc/YGjF7w3Z/logo-ateca.png',
    'PNG',
    margin,
    margin,
    30,
    15,
    undefined,
    'FAST'
  );

  // Header with better spacing
  doc.setFontSize(20);
  doc.text('Informe de Análisis de Datos', pageWidth / 2, margin + 8, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Curso: ${activeYear?.name || ''}`, pageWidth / 2, margin + 16, { align: 'center' });
  doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy', { locale: es })}`, pageWidth / 2, margin + 22, { align: 'center' });

  // User info
  doc.setFontSize(11);
  doc.text([
    `Usuario: ${user?.name} ${user?.lastName}`,
    `Red: ${networks.find(n => n.code === user?.network)?.name || ''}`,
    `Centro: ${user?.center}`,
  ], margin, margin + 30);

  // Filters section
  doc.setFontSize(12);
  doc.text('Filtros Aplicados:', margin, margin + 45);
  doc.setFontSize(10);

  // Separate network objectives and ODS
  const networkObjectives = objectives
    .filter(o => filters.objectives?.includes(o.id))
    .map(o => o.name)
    .join(', ');

  const selectedODS = ods
    .filter(o => filters.ods?.includes(o.id))
    .map(o => o.name)
    .join(', ');

  const filterTexts = [
    `Período: ${filters.startDate ? format(new Date(filters.startDate), 'dd/MM/yyyy') : 'Todos'} - ${filters.endDate ? format(new Date(filters.endDate), 'dd/MM/yyyy') : 'Todos'}`,
    `Red: ${filters.network ? networks.find(n => n.code === filters.network)?.name : 'Todas'}`,
    `Centro: ${filters.center || 'Todos'}`,
    `Departamento: ${filters.department ? departments.find(d => d.code === filters.department)?.name : 'Todos'}`,
    `Familia Profesional: ${filters.family ? families.find(f => f.code === filters.family)?.name : 'Todas'}`,
    `Objetivos de Red: ${networkObjectives || 'Todos'}`,
    `ODS: ${selectedODS || 'Todos'}`,
  ];

  doc.text(filterTexts, margin, margin + 50);

  // Data table with improved formatting
  const tableData = actions.map(action => [
    action.name,
    format(new Date(action.startDate), 'dd/MM/yyyy'),
    format(new Date(action.endDate), 'dd/MM/yyyy'),
    action.center,
    action.departments.map(code => departments.find(d => d.code === code)?.name).join('\n'),
    action.studentParticipants.toString(),
    action.teacherParticipants.toString(),
    action.rating.toString(), // Simple numeric rating
  ]);

  autoTable(doc, {
    startY: margin + 85,
    head: [['Nombre', 'Inicio', 'Fin', 'Centro', 'Departamentos', 'Est.', 'Prof.', 'Val.']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      lineWidth: 0.1,
      halign: 'left',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 45 },
      4: { cellWidth: 45 },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 15, halign: 'center' },
      7: { cellWidth: 15, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      // Add page number
      doc.setFontSize(10);
      doc.text(
        `Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${doc.internal.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - margin,
        { align: 'right' }
      );
    },
  });

  // Add charts in new pages
  if (Object.keys(chartImages).length > 0) {
    doc.addPage();

    const chartWidth = (pageWidth - (margin * 3)) / 2;
    const chartHeight = (pageHeight - (margin * 3)) / 2;

    // Helper function to add chart with title
    const addChart = (title: string, imageData: string, x: number, y: number) => {
      doc.setFontSize(12);
      doc.text(title, x, y);
      doc.addImage(imageData, 'PNG', x, y + 5, chartWidth - 5, chartHeight - 15, undefined, 'FAST');
    };

    // Add charts in a 2x2 grid
    let currentY = margin;

    if (chartImages['participation-chart']) {
      addChart('Participación', chartImages['participation-chart'], margin, currentY);
    }
    
    if (chartImages['network-chart']) {
      addChart('Distribución por Red', chartImages['network-chart'], margin + chartWidth + margin, currentY);
    }
    
    if (chartImages['department-chart']) {
      addChart('Distribución por Departamento', chartImages['department-chart'], margin, currentY + chartHeight + margin);
    }
    
    if (chartImages['objective-chart']) {
      addChart('Cumplimiento de Objetivos', chartImages['objective-chart'], margin + chartWidth + margin, currentY + chartHeight + margin);
    }
  }

  // Save PDF
  doc.save(`informe_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
};