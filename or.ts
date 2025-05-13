// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import MainLayout from '@/layouts/MainLayout';
// import { 
//   Container, 
//   Typography, 
//   Paper, 
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   Box,
//   Tabs,
//   Tab,
//   Divider,
//   Card,
//   CardContent,
//   IconButton,
//   TextField,
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import {
//   MagnifyingGlassIcon as SearchIcon,
//   ArrowPathIcon as ReloadIcon,
//   ShoppingBagIcon,
//   TruckIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';
// import { motion } from 'framer-motion';

// // Mock orders data
// const MOCK_ORDERS = [
//   {
//     id: 'ORD-235790',
//     date: '2023-10-15',
//     status: 'delivered',
//     total: 32.50,
//     items: 5,
//     delivery: {
//       address: '123 Main St, New York, NY 10001',
//       time: '2023-10-15T15:30:00',
//       eta: null, // null if already delivered
//       driver: {
//         name: 'John Smith',
//         phone: '+1 555-234-5678'
//       }
//     },
//     products: [
//       { id: '1', name: 'Fresh Apples', nameAr: 'تفاح طازج', quantity: 2, price: 5.99 },
//       { id: '2', name: 'Organic Milk', nameAr: 'حليب عضوي', quantity: 1, price: 3.49 },
//       { id: '3', name: 'Whole Wheat Bread', nameAr: 'خبز القمح الكامل', quantity: 1, price: 2.99 },
//     ]
//   },
//   {
//     id: 'ORD-982143',
//     date: '2023-10-20',
//     status: 'processing',
//     total: 45.75,
//     items: 8,
//     delivery: {
//       address: '456 Oak Ave, New York, NY 10002',
//       time: null,
//       eta: '2023-10-21T14:00:00',
//       driver: null
//     },
//     products: [
//       { id: '5', name: 'Organic Tomatoes', nameAr: 'طماطم عضوية', quantity: 3, price: 3.99 },
//       { id: '4', name: 'Fresh Chicken', nameAr: 'دجاج طازج', quantity: 1, price: 8.99 },
//       { id: '2', name: 'Organic Milk', nameAr: 'حليب عضوي', quantity: 2, price: 3.49 },
//     ]
//   },
//   {
//     id: 'ORD-562834',
//     date: '2023-10-22',
//     status: 'outForDelivery',
//     total: 28.35,
//     items: 4,
//     delivery: {
//       address: '789 Pine Blvd, New York, NY 10003',
//       time: null,
//       eta: '2023-10-22T17:30:00',
//       driver: {
//         name: 'Sarah Johnson',
//         phone: '+1 555-876-5432'
//       }
//     },
//     products: [
//       { id: '3', name: 'Whole Wheat Bread', nameAr: 'خبز القمح الكامل', quantity: 2, price: 2.99 },
//       { id: '1', name: 'Fresh Apples', nameAr: 'تفاح طازج', quantity: 3, price: 5.99 },
//     ]
//   }
// ];

// const OrdersPage = () => {
//   const { t } = useTranslation('common');
//   const router = useRouter();
//   const locale = router.locale || 'en';
//   const { direction } = useSelector((state: RootState) => state.ui);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   const [tabValue, setTabValue] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Handle tab change
//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue);
//   };
  
//   // Filter orders based on tab and search term
//   const filterOrders = () => {
//     let filtered = [...MOCK_ORDERS];
    
//     // Filter by status
//     if (tabValue === 1) {
//       filtered = filtered.filter(order => order.status === 'processing');
//     } else if (tabValue === 2) {
//       filtered = filtered.filter(order => order.status === 'outForDelivery');
//     } else if (tabValue === 3) {
//       filtered = filtered.filter(order => order.status === 'delivered');
//     }
    
//     // Filter by search term
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(order => 
//         order.id.toLowerCase().includes(searchLower)
//       );
//     }
    
//     return filtered;
//   };
  
//   const filteredOrders = filterOrders();
  
//   // Get status chip color and label
//   const getStatusInfo = (status: string) => {
//     switch (status) {
//       case 'processing':
//         return { 
//           color: 'info', 
//           label: t('orders.processing'),
//           icon: <ClockIcon className="h-4 w-4 mr-1" />
//         };
//       case 'outForDelivery':
//         return { 
//           color: 'warning', 
//           label: t('orders.outForDelivery'),
//           icon: <TruckIcon className="h-4 w-4 mr-1" /> 
//         };
//       case 'delivered':
//         return { 
//           color: 'success', 
//           label: t('orders.delivered'),
//           icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> 
//         };
//       default:
//         return { 
//           color: 'default', 
//           label: t('orders.pending'),
//           icon: <ClockIcon className="h-4 w-4 mr-1" /> 
//         };
//     }
//   };
  
//   // Format date based on locale
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
//   };
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: 'beforeChildren',
//         staggerChildren: 0.1,
//       },
//     },
//   };
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//     },
//   };
  
//   return (
//     <MainLayout>
//       <Container maxWidth="lg" className="py-8">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.div variants={itemVariants}>
//             <Typography variant="h4" component="h1" className="text-center font-bold mb-8">
//               {t('orders.title')}
//             </Typography>
//           </motion.div>
          
//           <motion.div variants={itemVariants}>
//             <Box className="flex justify-between items-center mb-6 flex-wrap gap-4">
//               <TextField
//                 placeholder={t('orders.searchPlaceholder')||""}
//                 variant="outlined"
//                 size="small"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon className="h-5 w-5 text-gray-400" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 className="w-full md:w-64"
//               />
              
//               <Button
//                 variant="outlined"
//                 startIcon={<ReloadIcon className="h-5 w-5" />}
//                 onClick={() => window.location.reload()}
//               >
//                 {t('common.refresh')}
//               </Button>
//             </Box>
//           </motion.div>
          
//           <motion.div variants={itemVariants}>
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               variant={isMobile ? "scrollable" : "standard"}
//               scrollButtons={isMobile ? "auto" : undefined}
//               className="mb-6"
//             >
//               <Tab label={t('orders.all')} />
//               <Tab label={t('orders.processing')} />
//               <Tab label={t('orders.outForDelivery')} />
//               <Tab label={t('orders.delivered')} />
//             </Tabs>
//           </motion.div>
          
//           {filteredOrders.length > 0 ? (
//             <motion.div variants={itemVariants}>
//               {isMobile ? (
//                 // Mobile view - cards
//                 <div className="space-y-4">
//                   {filteredOrders.map((order) => {
//                     const { color, label, icon } = getStatusInfo(order.status);
                    
//                     return (
//                       <Card key={order.id} className="overflow-hidden">
//                         <CardContent className="p-4">
//                           <Box className="flex justify-between items-start mb-3">
//                             <Box>
//                               <Typography variant="h6" className="font-bold">
//                                 {order.id}
//                               </Typography>
//                               <Typography variant="body2" color="textSecondary">
//                                 {formatDate(order.date)}
//                               </Typography>
//                             </Box>
//                             <Chip
//                               icon={icon}
//                               label={label}
//                               color={color as any}
//                               size="small"
//                               className="ml-auto"
//                             />
//                           </Box>
                          
//                           <Divider className="my-3" />
                          
//                           <Box className="flex justify-between items-center mb-2">
//                             <Typography variant="body2">
//                               {t('orders.totalItems')}:
//                             </Typography>
//                             <Typography variant="body1" className="font-medium">
//                               {order.items}
//                             </Typography>
//                           </Box>
                          
//                           <Box className="flex justify-between items-center mb-3">
//                             <Typography variant="body2">
//                               {t('orders.total')}:
//                             </Typography>
//                             <Typography variant="body1" className="font-medium">
//                               ${order.total.toFixed(2)}
//                             </Typography>
//                           </Box>
                          
//                           <Box className="flex justify-between mt-4">
//                             <Button
//                               variant="outlined"
//                               size="small"
//                               onClick={() => router.push(`/orders/${order.id}`)}
//                               endIcon={<ArrowRightIcon className="h-4 w-4" />}
//                             >
//                               {t('orders.details')}
//                             </Button>
                            
//                             {order.status === 'delivered' && (
//                               <Button
//                                 variant="outlined"
//                                 size="small"
//                                 color="primary"
//                                 startIcon={<ShoppingBagIcon className="h-4 w-4" />}
//                               >
//                                 {t('orders.reorder')}
//                               </Button>
//                             )}
                            
//                             {order.status === 'outForDelivery' && (
//                               <Button
//                                 variant="contained"
//                                 size="small"
//                                 color="primary"
//                                 className="bg-primary-600"
//                                 startIcon={<TruckIcon className="h-4 w-4" />}
//                               >
//                                 {t('orders.track')}
//                               </Button>
//                             )}
//                           </Box>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 // Desktop view - table
//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead className="bg-gray-50">
//                       <TableRow>
//                         <TableCell>{t('orders.orderNumber')}</TableCell>
//                         <TableCell>{t('orders.date')}</TableCell>
//                         <TableCell>{t('orders.status')}</TableCell>
//                         <TableCell>{t('orders.items')}</TableCell>
//                         <TableCell>{t('orders.total')}</TableCell>
//                         <TableCell align="right">{t('common.actions')}</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredOrders.map((order) => {
//                         const { color, label, icon } = getStatusInfo(order.status);
                        
//                         return (
//                           <TableRow key={order.id} hover>
//                             <TableCell>
//                               <Typography variant="body1" className="font-medium">
//                                 {order.id}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>{formatDate(order.date)}</TableCell>
//                             <TableCell>
//                               <Chip
//                                 icon={icon}
//                                 label={label}
//                                 color={color as any}
//                                 size="small"
//                               />
//                             </TableCell>
//                             <TableCell>{order.items}</TableCell>
//                             <TableCell>${order.total.toFixed(2)}</TableCell>
//                             <TableCell align="right">
//                               <Box className="flex justify-end space-x-2">
//                                 <Button
//                                   variant="outlined"
//                                   size="small"
//                                   onClick={() => router.push(`/orders/${order.id}`)}
//                                 >
//                                   {t('orders.details')}
//                                 </Button>
                                
//                                 {order.status === 'delivered' && (
//                                   <Button
//                                     variant="outlined"
//                                     size="small"
//                                     color="primary"
//                                     startIcon={<ShoppingBagIcon className="h-4 w-4" />}
//                                   >
//                                     {t('orders.reorder')}
//                                   </Button>
//                                 )}
                                
//                                 {order.status === 'outForDelivery' && (
//                                   <Button
//                                     variant="contained"
//                                     size="small"
//                                     color="primary"
//                                     className="bg-primary-600"
//                                     startIcon={<TruckIcon className="h-4 w-4" />}
//                                   >
//                                     {t('orders.track')}
//                                   </Button>
//                                 )}
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </motion.div>
//           ) : (
//             <motion.div variants={itemVariants}>
//               <Paper className="p-6 text-center">
//                 <Box className="flex justify-center mb-4">
//                   <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
//                 </Box>
//                 <Typography variant="h6" className="mb-2">
//                   {t('orders.empty')}
//                 </Typography>
//                 <Typography variant="body1" color="textSecondary" className="mb-4">
//                   {t('orders.emptyMessage')}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => router.push('/products')}
//                   className="bg-primary-600 hover:bg-primary-700"
//                 >
//                   {t('cart.startShopping')}
//                 </Button>
//               </Paper>
//             </motion.div>
//           )}
//         </motion.div>
//       </Container>
//     </MainLayout>
//   );
// };

// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// }

// export default OrdersPage; 