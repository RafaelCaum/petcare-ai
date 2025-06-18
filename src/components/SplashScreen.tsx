
import React from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/92b69a13-adf5-41ec-8d20-865983d3b0c6.png" 
            alt="Pet Care - Dog and Cat"
            className="w-64 h-64 mx-auto rounded-3xl shadow-gentle object-cover animate-bounce-gentle"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">Pet Care</h1>
        <p className="text-xl text-primary-foreground/80 mb-8">Your Pet's Health Assistant</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
