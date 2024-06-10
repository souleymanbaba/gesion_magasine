// import React from 'react';
// import { Navbar, Nav } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faThList, faBox, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Header.css'; // Assurez-vous d'avoir un fichier CSS pour vos styles personnalisés

// const Header = () => {
//   return (
//     <Navbar bg="dark" variant="dark" expand="lg">
//       <Navbar.Brand as={Link} to="/admin/Categorie">Admin</Navbar.Brand>
//       <Navbar.Toggle aria-controls="basic-navbar-nav" />
//       <Navbar.Collapse id="basic-navbar-nav">
//         <Nav className="ml-auto">
//           <Nav.Link as={Link} to="/admin/Categorie">
//             <FontAwesomeIcon icon={faThList} className="me-2" />
//             Category
//           </Nav.Link>
//           <Nav.Link as={Link} to="/admin/ProductsA">
//             <FontAwesomeIcon icon={faBox} className="me-2" />
//             Products
//           </Nav.Link>
//           <Nav.Link as={Link} to="/admin/orders">
//             <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//             Orders
//           </Nav.Link>
//         </Nav>
//       </Navbar.Collapse>
//       <Navbar.Text>
//         <Nav.Link as={Link} to="/logout">
//           <FontAwesomeIcon icon={faSignOutAlt} className="me" />
//           Logout
//         </Nav.Link>
//       </Navbar.Text>
//     </Navbar>
//   );
// };

// export default Header;













import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

const Header = () => {
  return (
    <div className="navigation">
      <ul>
        <li>
          <a href="#">
            <span className="icon">
              <ion-icon name="logo-apple"></ion-icon>
            </span>
            <span className="title">Admin</span>
          </a>
        </li>
        <li>
          <Link to="/admin/Categorie">
            <span className="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span className="title">Category</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/ProductsA">
            <span className="icon">
              <ion-icon name="cube-outline"></ion-icon>
            </span>
            <span className="title">Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span className="icon">
              <ion-icon name="cart-outline"></ion-icon>
            </span>
            <span className="title">Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <span className="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span className="title">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;


