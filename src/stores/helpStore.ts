import { create } from 'zustand';
import type { HelpSection } from '../types/help';

interface HelpState {
  sections: HelpSection[];
  setSections: (sections: HelpSection[]) => void;
  addSection: (section: Omit<HelpSection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSection: (id: string, section: Partial<HelpSection>) => void;
  deleteSection: (id: string) => void;
  getSection: (id: string) => HelpSection | undefined;
  getChildSections: (parentId?: string) => HelpSection[];
}

// Secciones iniciales del manual
const initialSections: HelpSection[] = [
  {
    id: 'admin',
    title: 'Administrador del Sistema',
    content: `
      <h2>Administrador del Sistema</h2>
      
      <div class="module">
        <h4>Gestión de Usuarios</h4>
        <ul>
          <li>Crear nuevos usuarios y asignar roles</li>
          <li>Generar códigos de registro</li>
          <li>Gestionar permisos y accesos</li>
          <li>Resetear contraseñas</li>
        </ul>
        <div class="note">
          Los códigos de registro son válidos por 7 días y pueden usarse una sola vez.
        </div>
      </div>
      
      <div class="module">
        <h4>Configuración del Sistema</h4>
        <ul>
          <li>Personalizar apariencia (logo, colores)</li>
          <li>Configurar servidor de correo</li>
          <li>Gestionar videoconferencias</li>
          <li>Administrar roles y permisos</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Registros Maestros</h4>
        <ul>
          <li>Gestionar redes de centros</li>
          <li>Administrar centros educativos</li>
          <li>Configurar familias profesionales</li>
          <li>Definir departamentos</li>
          <li>Establecer objetivos estratégicos</li>
        </ul>
      </div>
    `,
    parentId: undefined,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'general-coordinator',
    title: 'Coordinador General',
    content: `
      <h2>Coordinador General</h2>
      
      <div class="module">
        <h4>Gestión de Acciones</h4>
        <ul>
          <li>Crear y editar acciones para toda la red</li>
          <li>Aprobar acciones propuestas</li>
          <li>Asignar objetivos estratégicos</li>
          <li>Evaluar resultados</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Reportes y Estadísticas</h4>
        <ul>
          <li>Generar informes globales</li>
          <li>Analizar indicadores de rendimiento</li>
          <li>Exportar datos a Excel</li>
          <li>Visualizar gráficos interactivos</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Calendario y Reuniones</h4>
        <ul>
          <li>Programar reuniones de red</li>
          <li>Gestionar videoconferencias</li>
          <li>Enviar convocatorias por email</li>
          <li>Dar seguimiento a acuerdos</li>
        </ul>
      </div>
    `,
    parentId: undefined,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subnet-coordinator',
    title: 'Coordinador de Subred',
    content: `
      <h2>Coordinador de Subred</h2>
      
      <div class="module">
        <h4>Gestión de Centro</h4>
        <ul>
          <li>Administrar acciones del centro</li>
          <li>Coordinar departamentos</li>
          <li>Gestionar participantes</li>
          <li>Asignar responsables</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Seguimiento</h4>
        <ul>
          <li>Monitorear progreso de acciones</li>
          <li>Validar participación</li>
          <li>Revisar valoraciones</li>
          <li>Generar informes de centro</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Comunicación</h4>
        <ul>
          <li>Coordinar con otros centros</li>
          <li>Organizar reuniones locales</li>
          <li>Difundir buenas prácticas</li>
          <li>Gestionar notificaciones</li>
        </ul>
      </div>
    `,
    parentId: undefined,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'manager',
    title: 'Gestor',
    content: `
      <h2>Gestor</h2>
      
      <div class="module">
        <h4>Registro de Acciones</h4>
        <ul>
          <li>Crear nuevas acciones</li>
          <li>Documentar actividades</li>
          <li>Subir imágenes y archivos</li>
          <li>Registrar participantes</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Participación</h4>
        <ul>
          <li>Unirse a acciones existentes</li>
          <li>Valorar actividades</li>
          <li>Añadir comentarios</li>
          <li>Compartir experiencias</li>
        </ul>
      </div>
      
      <div class="module">
        <h4>Consulta</h4>
        <ul>
          <li>Ver calendario de actividades</li>
          <li>Consultar documentación</li>
          <li>Acceder al observatorio</li>
          <li>Revisar estadísticas personales</li>
        </ul>
      </div>
    `,
    parentId: undefined,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'permissions',
    title: 'Tabla de Permisos',
    content: `
      <h2>Tabla de Permisos por Rol</h2>
      <table>
        <thead>
          <tr>
            <th>Módulo</th>
            <th>Administrador</th>
            <th>Coordinador General</th>
            <th>Coordinador Subred</th>
            <th>Gestor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Usuarios</td>
            <td>CRUD</td>
            <td>Lectura</td>
            <td>Lectura</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Acciones</td>
            <td>CRUD</td>
            <td>CRUD</td>
            <td>CRUD (Red)</td>
            <td>CRU (Centro)</td>
          </tr>
          <tr>
            <td>Registros Maestros</td>
            <td>CRUD</td>
            <td>Lectura</td>
            <td>Lectura</td>
            <td>Lectura</td>
          </tr>
          <tr>
            <td>Reportes</td>
            <td>CRUD</td>
            <td>CRUD</td>
            <td>Lectura</td>
            <td>Lectura</td>
          </tr>
          <tr>
            <td>Observatorio</td>
            <td>CRUD</td>
            <td>CRUD</td>
            <td>CRU</td>
            <td>Lectura</td>
          </tr>
          <tr>
            <td>Configuración</td>
            <td>CRUD</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <div class="note">
        CRUD: Create (Crear), Read (Leer), Update (Actualizar), Delete (Eliminar)<br>
        CRU: Create (Crear), Read (Leer), Update (Actualizar)<br>
        -: Sin acceso
      </div>
    `,
    parentId: undefined,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useHelpStore = create<HelpState>((set, get) => ({
  sections: initialSections,
  
  setSections: (sections) => set({ sections }),
  
  addSection: (sectionData) => {
    const section: HelpSection = {
      ...sectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      sections: [...state.sections, section]
    }));
  },
  
  updateSection: (id, sectionData) => {
    set(state => ({
      sections: state.sections.map(section =>
        section.id === id
          ? {
              ...section,
              ...sectionData,
              updatedAt: new Date().toISOString(),
            }
          : section
      ),
    }));
  },
  
  deleteSection: (id) => {
    set(state => ({
      sections: state.sections.filter(section => section.id !== id),
    }));
  },
  
  getSection: (id) => {
    return get().sections.find(section => section.id === id);
  },
  
  getChildSections: (parentId) => {
    return get().sections
      .filter(section => section.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  },
}));