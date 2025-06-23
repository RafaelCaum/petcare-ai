
import React from 'react';
import { LogOut } from 'lucide-react';

const SupportSection: React.FC = () => {
  return (
    <>
      {/* Support & Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-4 text-gray-900">Support & Information</h2>
        
        <div className="space-y-2 text-sm">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Help & FAQ
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Contact Support
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Privacy Policy
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors text-gray-600">
            Terms of Service
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors flex items-center text-red-600">
          <LogOut size={16} className="mr-3 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
};

export default SupportSection;
