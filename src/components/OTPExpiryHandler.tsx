
import React, { useState, useEffect } from 'react';
import { Clock, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface OTPExpiryHandlerProps {
  onResendOTP: () => Promise<void>;
  otpSentTime: Date | null;
  expiryMinutes?: number;
}

const OTPExpiryHandler: React.FC<OTPExpiryHandlerProps> = ({ 
  onResendOTP, 
  otpSentTime, 
  expiryMinutes = 30 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!otpSentTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const sentTime = new Date(otpSentTime);
      const expiryTime = new Date(sentTime.getTime() + expiryMinutes * 60 * 1000);
      const remainingTime = expiryTime.getTime() - now.getTime();

      if (remainingTime <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeft(Math.floor(remainingTime / 1000));
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSentTime, expiryMinutes]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResendOTP();
      setIsExpired(false);
      toast.success('Novo código enviado!');
    } catch (error) {
      toast.error('Erro ao reenviar código');
    } finally {
      setIsResending(false);
    }
  };

  if (!otpSentTime) return null;

  return (
    <div className="text-center space-y-3">
      {!isExpired ? (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Clock size={16} className="mr-2" />
          Código expira em: {formatTime(timeLeft)}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-red-600 font-medium">
            ⏰ Código expirado
          </div>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="flex items-center justify-center w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isResending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <RefreshCcw size={16} className="mr-2" />
            )}
            {isResending ? 'Enviando...' : 'Reenviar código'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPExpiryHandler;
