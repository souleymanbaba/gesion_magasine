// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form, Table, Container, Spinner } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import './Style.css'; // Assurez-vous d'ajuster le chemin si nécessaire
// import { getlang } from '../../Account/userStorageService';

// const Orders = () => {
//   const { t, i18n } = useTranslation();
//   const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [newStatus, setNewStatus] = useState('');
//   const [cartItems, setCartItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const ordersPerPage = 5; // Nombre de commandes par page

//   useEffect(() => {
//     fetchOrders();
//   }, [i18n.language]); // Ajout de la langue comme dépendance pour refetcher les commandes

//   const fetchOrders = async () => {
//     try {
//       const lang = i18n.language; // Utilisez la langue actuelle
//       const response = await axios.get('http://localhost:8080/api/admin/placedOrders', {
//         params: { lang }
//       });
//       setOrders(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des commandes :', error.message);
//       setLoading(false);
//     }
//   };

//   const fetchCartItems = async (userId, orderStatus) => {
//     try {
//       const lang = i18n.language; // Utilisez la langue actuelle
//       const url = orderStatus === 'Shipped'
//         ? `http://localhost:8080/api/customer/cartIi/${userId}`
//         : `http://localhost:8080/api/customer/cartI/${userId}`;
//       const response = await axios.get(url, {
//         params: { lang }
//       });
//       setCartItems(response.data.cartItems);
//       setShowCartModal(true);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des articles du panier :', error.message);
//     }
//   };

//   const handleChangeStatus = async () => {
//     try {
//       const lang = i18n.language; // Utilisez la langue actuelle
//       const response = await axios.get(`http://localhost:8080/api/admin/order/${selectedOrder.id}/${newStatus}`, {
//         params: { lang }
//       });
//       if (response.status === 200) {
//         console.log('Statut de la commande mis à jour avec succès !');
//         const updatedOrders = orders.map(order => {
//           if (order.id === selectedOrder.id) {
//             return { ...order, orderStatus: newStatus };
//           }
//           return order;
//         });
//         setOrders(updatedOrders);
//         setShowStatusModal(false);
//       } else {
//         console.error('Échec de la mise à jour du statut de la commande');
//       }
//     } catch (error) {
//       console.error('Erreur :', error);
//     }
//   };

//   const handleShowStatusModal = (order) => {
//     setSelectedOrder(order);
//     setNewStatus('');
//     setShowStatusModal(true);
//   };

//   const handleShowCartModal = (order) => {
//     fetchCartItems(order.user_id, order.orderStatus);
//   };

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   if (loading) return (
//     <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//       <Spinner animation="border" />
//     </Container>
//   );

//   // Logique pour afficher les commandes sur la page actuelle
//   const offset = currentPage * ordersPerPage;
//   const currentOrders = orders.slice(offset, offset + ordersPerPage);

//   return (
//     <Container fluid>
//       <br />
//       <h1 dir={direction}>{t('orders.title')}</h1>
      
//       <div className="row">
//         <div className="col-lg-2">
//           {/* Contenu de la barre latérale ici */}
//         </div>
//         <div className="col-lg-9">
//           <div className="table-responsive">
//             <Table className="table-wrapper" dir={direction} striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>{t('orders.userId')}</th>
//                   <th>{t('orders.date')}</th>
//                   <th>{t('orders.status')}</th>
//                   <th>{t('orders.totalAmount')}</th>
//                   <th>{t('orders.address')}</th>
//                   <th>{t('orders.actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentOrders.map(order => (
//                   <tr key={order.id}>
//                     <td>{order.userName}</td>
//                     <td>{order.date}</td>
//                     <td>{order.orderStatus}</td>
//                     <td>{order.totalAmount}</td>
//                     <td>{order.address}</td>
//                     <td>
//                       <div className="d-flex">
//                         <Button variant="info" size="sm" onClick={() => handleShowCartModal(order)}>
//                           {t('orders.viewCart')}
//                         </Button>
//                         <Button variant="secondary" size="sm" onClick={() => handleShowStatusModal(order)}>
//                           {t('orders.changeStatus')}
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{t('orders.changeStatus')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>{t('orders.status')}</Form.Label>
//               <Form.Control 
//                 as="select" 
//                 value={newStatus} 
//                 onChange={(e) => setNewStatus(e.target.value)}
//               >
//                 <option value="">{t('orders.selectStatus')}</option>
//                 <option value="Shipped">{t('orders.shipped')}</option>
//                 <option value="Delivered">{t('orders.delivered')}</option>
//               </Form.Control>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
//             {t('common.close')}
//           </Button>
//           <Button variant="primary" onClick={handleChangeStatus}>
//             {t('orders.change')}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{t('orders.cartItems')}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {cartItems.length > 0 ? (
//             <Table striped bordered hover dir={direction}>
//               <thead>
//                 <tr>
//                   <th>{t('orders.image')}</th>
//                   <th>{t('orders.size')}</th>
//                   <th>{t('orders.marque')}</th>
//                   <th>{t('orders.quantity')}</th>
//                   <th>{t('orders.price')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map(item => (
//                   <tr key={item.id} dir={direction}>
//                     <td><img src={`data:image/jpeg;base64,${item.returnedImg}`} alt={item.productName} style={{ width: '50px' }} /></td>
//                     <td>{item.taille}</td>
//                     <td>{item.marque}</td>
//                     <td>{item.quantity}</td>
//                     <td>{item.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>{t('orders.noItems')}</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCartModal(false)}>
//             {t('common.close')}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <ReactPaginate
//         previousLabel={t('pagination.previous')}
//         nextLabel={t('pagination.next')}
//         pageCount={Math.ceil(orders.length / ordersPerPage)}
//         onPageChange={handlePageClick}
//         containerClassName={'pagination justify-content-center'}
//         activeClassName={'active'}
//       />
//     </Container>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Style.css'; // Ensure the path is correct
import { getlang } from '../../Account/userStorageService';

const Orders = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [mapCoordinates, setMapCoordinates] = useState({ latitude: null, longitude: null });
  const ordersPerPage = 5; // Number of orders per page

  useEffect(() => {
    fetchOrders();
  }, [i18n.language]); // Fetch orders when language changes

  const fetchOrders = async () => {
    try {
      const lang = i18n.language;
      const response = await axios.get('http://localhost:8080/api/admin/placedOrders', {
        params: { lang }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setLoading(false);
    }
  };

  const fetchCartItems = async (userId, orderStatus) => {
    try {
      const lang = i18n.language;
      const url = orderStatus === 'Shipped'
        ? `http://localhost:8080/api/customer/cartIi/${userId}`
        : `http://localhost:8080/api/customer/cartI/${userId}`;
      const response = await axios.get(url, {
        params: { lang }
      });
      setCartItems(response.data.cartItems);
      setShowCartModal(true);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
    }
  };

  const handleChangeStatus = async () => {
    try {
      const lang = i18n.language;
      const response = await axios.get(`http://localhost:8080/api/admin/order/${selectedOrder.id}/${newStatus}`, {
        params: { lang }
      });
      if (response.status === 200) {
        console.log('Order status updated successfully!');
        const updatedOrders = orders.map(order => {
          if (order.id === selectedOrder.id) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
        setShowStatusModal(false);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShowStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setShowStatusModal(true);
  };

  const handleShowCartModal = (order) => {
    fetchCartItems(order.user_id, order.orderStatus);
  };

  const handleShowMapModal = (latitude, longitude) => {
    setMapCoordinates({ latitude, longitude });
    setShowMapModal(true);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" />
    </Container>
  );

  const offset = currentPage * ordersPerPage;
  const currentOrders = orders.slice(offset, offset + ordersPerPage);

  return (
    <Container fluid>
      <br />
      <h1 dir={direction}>{t('orders.title')}</h1>
      
      <div className="row">
        <div className="col-lg-2">
          {/* Sidebar content here */}
        </div>
        <div className="col-lg-9">
          <div className="table-responsive">
            <Table className="table-wrapper" dir={direction} striped bordered hover>
              <thead>
                <tr>
                  <th>{t('orders.userId')}</th>
                  <th>{t('orders.date')}</th>
                
                  <th>{t('orders.totalAmount')}</th>
                  <th>{t('orders.address')}</th>
                  <th>{t('orders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.userName}</td>
                    <td>{order.date}</td>
                    {/* <td>{order.orderStatus}</td> */}
                    <td>{order.totalAmount}</td>
                    <td>{order.address}</td>
                    <td>
                      <div className="d-flex">
                        <Button variant="info" size="sm" onClick={() => handleShowCartModal(order)}>
                          {t('orders.viewCart')}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleShowStatusModal(order)}>
                          {t('orders.changeStatus')}
                        </Button>
                        {order.latitude !== null && order.longitude !== null && (
                          <Button variant="primary" size="sm" onClick={() => handleShowMapModal(order.latitude, order.longitude)}>
                            {t('orders.viewLocation')}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('orders.changeStatus')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('orders.status')}</Form.Label>
              <Form.Control 
                as="select" 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">{t('orders.selectStatus')}</option>
                <option value="Shipped">{t('orders.shipped')}</option>
                <option value="Delivered">{t('orders.delivered')}</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={handleChangeStatus}>
            {t('orders.change')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('orders.cartItems')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length > 0 ? (
            <Table striped bordered hover dir={direction}>
              <thead>
                <tr>
                  <th>{t('orders.image')}</th>
                  <th>{t('orders.size')}</th>
                  <th>{t('orders.marque')}</th>
                  <th>{t('orders.quantity')}</th>
                  <th>{t('orders.price')}</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} dir={direction}>
                    <td><img src={`data:image/jpeg;base64,${item.returnedImg}`} alt={item.productName} style={{ width: '50px' }} /></td>
                    <td>{item.taille}</td>
                    <td>{item.marque}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>{t('orders.noItems')}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            {t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t('orders.mapLocation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mapCoordinates.latitude && mapCoordinates.longitude && (
            <MapContainer 
              center={[mapCoordinates.latitude, mapCoordinates.longitude]} 
              zoom={13} 
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[mapCoordinates.latitude, mapCoordinates.longitude]} />
            </MapContainer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMapModal(false)}>
            {t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div dir={direction}>

      <ReactPaginate 
    previousLabel={t('pagination.previous')}
    nextLabel={t('pagination.next')}
        breakLabel="..."
        breakClassName="break-me"
        pageCount={Math.ceil(orders.length / ordersPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
      />
      </div>
    </Container>
  );
};

export default Orders;
