
import React, { useEffect } from 'react';

const CacheCleaner: React.FC = () => {
  useEffect(() => {
    // Limpar localStorage
    localStorage.clear();
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar cookies (se houver)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log("Cache completamente limpo!");
    
    // Recarregar a página após limpar
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Limpando Cache...</h2>
        <p className="text-gray-600 mb-4">Removendo todos os dados locais e recarregando...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default CacheCleaner;
