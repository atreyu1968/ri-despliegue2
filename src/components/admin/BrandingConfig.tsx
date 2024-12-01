import React, { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import { useBrandingStore } from '../../stores/brandingStore';
import type { BrandingConfig as BrandingConfigType } from '../../types/admin';

const BrandingConfig = () => {
  const { config, updateConfig } = useBrandingStore();
  const [formData, setFormData] = useState<BrandingConfigType>(config);
  const [logoPreview, setLogoPreview] = useState<string | null>(config.logoUrl);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(config.faviconUrl);

  useEffect(() => {
    // Update favicon in the document when it changes
    if (formData.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = formData.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [formData.faviconUrl]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setFormData(prev => ({ ...prev, logoUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFaviconPreview(base64);
        setFormData(prev => ({ ...prev, faviconUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  const predefinedThemes = [
    {
      name: 'Default',
      colors: {
        primary: '#2563eb',
        secondary: '#4b5563',
        accent: '#8b5cf6',
      },
    },
    {
      name: 'Ocean',
      colors: {
        primary: '#0891b2',
        secondary: '#334155',
        accent: '#06b6d4',
      },
    },
    {
      name: 'Forest',
      colors: {
        primary: '#059669',
        secondary: '#374151',
        accent: '#10b981',
      },
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Identidad Visual
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-auto"
                />
              )}
              <label className="flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">Subir Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              {faviconPreview && (
                <img
                  src={faviconPreview}
                  alt="Favicon preview"
                  className="h-8 w-8"
                />
              )}
              <label className="flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">Subir Favicon</span>
                <input
                  type="file"
                  accept="image/x-icon,image/png"
                  onChange={handleFaviconChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Recomendado: PNG 32x32px o ICO
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuente Principal
            </label>
            <select
              value={formData.font}
              onChange={(e) => setFormData(prev => ({ ...prev, font: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="opensans">Open Sans</option>
              <option value="lato">Lato</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Colores
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Principal
            </label>
            <input
              type="color"
              value={formData.colors.primary}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                colors: { ...prev.colors, primary: e.target.value }
              }))}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <input
              type="color"
              value={formData.colors.secondary}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                colors: { ...prev.colors, secondary: e.target.value }
              }))}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Acento
            </label>
            <input
              type="color"
              value={formData.colors.accent}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                colors: { ...prev.colors, accent: e.target.value }
              }))}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Temas Predefinidos
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {predefinedThemes.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                colors: theme.colors
              }))}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="text-sm font-medium mb-2">{theme.name}</div>
              <div className="flex space-x-2">
                {Object.values(theme.colors).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-5 h-5" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </form>
  );
};

export default BrandingConfig;