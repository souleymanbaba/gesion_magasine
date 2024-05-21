import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/placedOrders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/order/${orderId}/${newStatus}`);
      
      if (response.status === 200) {
        console.log('Statut de la commande mis à jour avec succès !');
        // Mettre à jour l'état local ou effectuer d'autres actions nécessaires
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, order_status: newStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
      } else {
        console.error('Échec de la mise à jour du statut de la commande');
        // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions nécessaires
      }
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
      // Gérer les erreurs de requête, par exemple afficher un message d'erreur à l'utilisateur
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="my-4">Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_id}</td>
              <td>{order.date}</td>
              <td>{order.order_status}</td>
              <td>{order.total_amount}</td>
              <td>{order.payment}</td>
              <td>
                <div>
                  <input 
                    type="text" 
                    placeholder="New Status" 
                    value={order.newStatus} 
                    onChange={(e) => handleChangeStatus(order.id, e.target.value)} 
                  />
                  <button onClick={() => handleChangeStatus(order.id, order.newStatus)}>Change Status</button>
                </div>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
