import React, { useState } from 'react';
import { Info } from 'lucide-react';

const SidebarBranding = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="mt-auto border-t border-gray-700">
      <div className="p-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full group"
        >
          <div className="relative overflow-hidden rounded-lg bg-transparent hover:bg-gray-800/30 transition-colors duration-300 p-4">
            <div className="flex items-center justify-center">
              <Info className="w-6 h-6 text-gray-400/70 group-hover:text-white/90 transition-all duration-300 transform group-hover:scale-110" />
            </div>
          </div>
        </button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl shadow-2xl w-[65%] relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 opacity-5"></div>
            <div className="relative p-8 flex items-center space-x-8">
              <div className="w-1/3">
                <img
                  src="https://i.postimg.cc/gnm7HSkQ/logo-ateca.png"
                  alt="Ateca TechLab"
                  className="w-full h-auto brightness-0 invert transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Red de Innovación FP
                </h3>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Software diseñado por la inteligencia humana y programado por la inteligencia artificial
                </p>
                <div className="h-px bg-gradient-to-r from-blue-200 to-transparent opacity-20 my-6"></div>
                <p className="text-sm text-blue-200 leading-relaxed">
                  Un proyecto del Ateca TechLab del Aula Ateca del IES MANUEL MARTÍN GONZÁLEZ
                </p>
                <button
                  onClick={() => setShowInfo(false)}
                  className="mt-6 px-8 py-3 text-sm font-medium text-blue-900 bg-white rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarBranding;