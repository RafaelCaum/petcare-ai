
import React from 'react';

const Index = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Projeto Limpo!</h1>
        <p className="text-gray-600 mb-6">
          O banco de dados foi completamente limpo e você pode começar seu projeto do zero.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ Todas as tabelas removidas<br/>
            ✅ Políticas RLS removidas<br/>
            ✅ Storage buckets limpos<br/>
            ✅ Cache do navegador limpo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
