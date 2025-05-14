import { useState, useEffect } from 'react';

type DeliveryStatus = 'online' | 'offline' | 'busy';

export const useDeliveryStatus = () => {
  // Use localStorage to persist status between page refreshes
  const [status, setStatus] = useState<DeliveryStatus>('offline');
  
  // Load status from localStorage on initial render
  useEffect(() => {
    const savedStatus = localStorage.getItem('deliveryStatus');
    if (savedStatus && (savedStatus === 'online' || savedStatus === 'offline' || savedStatus === 'busy')) {
      setStatus(savedStatus as DeliveryStatus);
    }
  }, []);
  
  // Save status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('deliveryStatus', status);
    
    // In a real app, we would also update the status on the server
    // For example:
    // api.updateDeliveryPersonStatus(status);
  }, [status]);
  
  // Update status with validation
  const updateStatus = (newStatus: DeliveryStatus) => {
    if (['online', 'offline', 'busy'].includes(newStatus)) {
      setStatus(newStatus);
    } else {
      console.error('Invalid delivery status:', newStatus);
    }
  };
  
  return {
    status,
    setStatus: updateStatus,
    isOnline: status === 'online',
    isBusy: status === 'busy',
    isOffline: status === 'offline',
  };
};

export default useDeliveryStatus; 