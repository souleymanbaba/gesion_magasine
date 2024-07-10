import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Container, Spinner, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';
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
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, [i18n.language]); // Fetch orders when language changes

  const fetchOrders = async () => {
    try {
      const lang = i18n.language;
      const response = await axios.get('http://localhost:8080/api/admin/placedOrders', {
        params: { lang }
      });
      const filteredOrders = response.data.filter(order => order.orderStatus !== 'Delivered');
      setOrders(filteredOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setLoading(false);
    }
  };

  const fetchCartItems = async (userId, orderId) => {
    try {
      const lang = i18n.language;
      const url =  `http://localhost:8080/api/customer/cartI/${userId}`;
      const response = await axios.get(url, {
        params: { lang,orderId }
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
        setOrders(updatedOrders.filter(order => order.orderStatus !== 'Delivered'));
        setShowStatusModal(false);
        Swal.fire({
          title: t('orders.statusUpdated'),
          text: t('orders.statusUpdatedMessage'),
          icon: 'success',
          confirmButtonText: 'OK'
        });
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
    fetchCartItems(order.user_id, order.id);
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
    <Container fluid style={{ direction }}>
      <br />
      <br></br>
      <br></br>
      <br></br>
      {/* <h1>{t('orders.title')}</h1> */}
      <div className="row">
        <div className="col-lg-2">
          {/* Sidebar content here */}
        </div>
        <div className="col-lg-9">
          <div className="table-container">
            <div className="table-wrapper">
              <Table striped bordered hover responsive>
                <thead className="admin-products__table-header">
                  <tr>
                    <th>{t('orders.userId')}</th>
                    <th>{t('orders.date')}</th>
                    <th>{t('orders.totalAmount')}</th>
                    <th>{t('orders.address')}</th>
                    <th>{t('orders.status')}</th>
                    <th>{t('en.Moughataa')}</th>
                    <th>{t('orders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map(order => (
                    <tr key={order.id} className="admin-products__table-row">
                      <td>{order.userName}</td>
                      <td>{order.date}</td>
                      <td>{order.totalAmount}</td>
                      <td>{order.address}</td>
                      <td>
                        {order.orderStatus === "Shipped" ? (
                          <Badge className="badge-shipped">{t('PStatusShipped')}</Badge>
                        ) : (
                          <Badge  className="badge-pending">{t('PStatusPending')}</Badge>
                        )}
                      </td>
                      <td>{order.wilaya}</td>
                      <td>

                        <div className="d-flex">
                          <Button variant="info" size="sm" className="mr-2 mb-1" onClick={() => handleShowCartModal(order)}>
                            {t('orders.viewCart')}
                          </Button>
                          <Button variant="secondary" size="sm" className="mr-2 mb-1" onClick={() => handleShowStatusModal(order)}>
                            {t('orders.changeStatus')}
                          </Button>
                          {order.latitude !== null && order.longitude !== null && (
                            <Button variant="primary" size="sm" className="mr-2 mb-1" onClick={() => handleShowMapModal(order.latitude, order.longitude)}>
                              {t('orders.viewLocation')}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center">
                <ReactPaginate
                  previousLabel={t('pagination.previous')}
                  nextLabel={t('pagination.next')}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={Math.ceil(orders.length / ordersPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  nextLinkClassName={'page-link'}
                  disabledClassName={'disabled'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('orders.changeStatus')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
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
        
        <Modal.Footer >
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            {t('common.close')}
          </Button>
          <Button variant="primary" onClick={handleChangeStatus}>
            {t('orders.change')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} centered >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('orders.cartItems')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {cartItems.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="admin-products__table-header">
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
                  <tr key={item.id} className="admin-products__table-row">
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
        <Modal.Footer >
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            {t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg" centered >
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{t('orders.mapLocation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
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
        <Modal.Footer >
          <Button variant="secondary" onClick={() => setShowMapModal(false)}>
            {t('common.close')}
          </Button>
        </Modal.Footer>
      </Modal>

      <div dir={direction}>
      
      </div>
    </Container>
  );
};

export default Orders;
