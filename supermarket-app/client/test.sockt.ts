// // Client-side test script
// const socket = io('http://localhost:5000', {
//     auth: {
//       token: 'your_jwt_token'
//     }
//   });
  
//   socket.on('connect', () => {
//     console.log('Connected to server');
//   });
  
//   socket.on('authenticated', (data) => {
//     console.log('Authentication status:', data);
    
//     if (data.success) {
//       // Join a room for an order
//       socket.emit('joinOrderRoom', 'order_id_here');
//     }
//   });
  
//   socket.on('orderStatusUpdated', (data) => {
//     console.log('Order status updated:', data);
//   });
  
//   socket.on('disconnect', () => {
//     console.log('Disconnected from server');
//   });
  
//   socket.on('error', (error) => {
//     console.error('Socket error:', error);
//   });