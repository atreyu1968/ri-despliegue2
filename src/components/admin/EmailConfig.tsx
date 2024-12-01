import React, { useState } from 'react';
import { Save, Send, AlertCircle } from 'lucide-react';
import { useEmailConfigStore } from '../../stores/emailConfigStore';
import type { EmailConfig as EmailConfigType } from '../../types/admin';

const EmailConfig = () => {
  const { config, updateConfig, testConnection } = useEmailConfigStore();
  const [formData, setFormData] = useState<EmailConfigType>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (provider: EmailConfigType['provider']) => {
    setFormData(prev => ({
      ...prev,
      provider,
      settings: {
        ...prev.settings,
        // Reset provider-specific settings
        apiKey: undefined,
        region: undefined,
        host: provider === 'smtp' ? '' : undefined,
        port: provider === 'smtp' ? 587 : undefined,
        username: provider === 'smtp' ? '' : undefined,
        password: provider === 'smtp' ? '' : undefined,
      }
    }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const success = await testConnection();
      setTestResult({
        success,
        message: success 
          ? 'Conexión exitosa' 
          : 'Error al conectar con el servidor de correo'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al probar la conexión'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configuración de Correo
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proveedor de Correo
            </label>
            <select
              value={formData.provider}
              onChange={(e) => handleProviderChange(e.target.value as EmailConfigType['provider'])}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="smtp">SMTP (Gmail, Outlook, etc)</option>
              <option value="sendgrid">SendGrid</option>
              <option value="ses">Amazon SES</option>
            </select>
          </div>

          {formData.provider === 'smtp' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={formData.settings.host}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, host: e.target.value }
                  }))}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puerto
                </label>
                <input
                  type="number"
                  value={formData.settings.port}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, port: parseInt(e.target.value) }
                  }))}
                  placeholder="587"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  value={formData.settings.username}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, username: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.settings.password}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, password: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {formData.provider === 'sendgrid' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={formData.settings.apiKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, apiKey: e.target.value }
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {formData.provider === 'ses' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.settings.apiKey}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, apiKey: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región
                </label>
                <input
                  type="text"
                  value={formData.settings.region}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, region: e.target.value }
                  }))}
                  placeholder="eu-west-1"
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Remitente
            </label>
            <input
              type="text"
              value={formData.settings.fromName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, fromName: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email del Remitente
            </label>
            <input
              type="email"
              value={formData.settings.fromEmail}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, fromEmail: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  enabled: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Habilitar envío de correos
              </span>
            </label>
          </div>
        </div>
      </div>

      {testResult && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          testResult.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{testResult.message}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
        </button>
        
        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Save className="w-5 h-5" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </form>
  );
};

export default EmailConfig;