// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProductCard from './ProductCard';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilter, faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';
// import { useTranslation } from 'react-i18next';
// import { getlang } from '../pages/Account/userStorageService';
// import Pagination from 'react-bootstrap/Pagination';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function Products() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedBrand, setSelectedBrand] = useState('');
//   const [direction, setDirection] = useState('ltr');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(6);

//   const { t, i18n } = useTranslation();

//   useEffect(() => {
//     if (i18n.language === 'ar') {
//       setDirection('rtl');
//     } else {
//       setDirection('ltr');
//     }
//     fetchProducts();
//     fetchCategories();
//   }, [i18n.language]);

//   useEffect(() => {
//     if (!selectedSize && !selectedBrand) {
//       updateSizeAndBrandLists(products);
//     }
//   }, [products]);

//   const fetchProducts = (categoryId, size, brand) => {
//     let url = 'http://localhost:8080/api/admin/products';
//     if (categoryId) {
//       url = `http://localhost:8080/api/admin/category/${categoryId}`;
//     }
//     let lang = getlang();
//     axios.get(url, { params: { lang } })
//       .then(response => {
//         let filteredProducts = response.data;
//         if (size) {
//           filteredProducts = filteredProducts.filter(product => product.taille === size);
//         }
//         if (brand) {
//           filteredProducts = filteredProducts.filter(product => product.marque === brand);
//         }
//         setProducts(filteredProducts);
//         setFilteredProducts(filteredProducts);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the products!', error);
//       });
//   };

//   const fetchCategories = () => {
//     const url = 'http://localhost:8080/api/admin/categories';
//     const lang = getlang();
//     axios.get(url, { params: { lang } })
//       .then(response => {
//         setCategories(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the categories!', error);
//       });
//   };

//   const updateSizeAndBrandLists = (products) => {
//     const uniqueSizes = [...new Set(products.map(product => product.taille))];
//     const uniqueBrands = [...new Set(products.map(product => product.marque))];
//     setSizes(uniqueSizes);
//     setBrands(uniqueBrands);
//   };

//   const updateCart = (product) => {
//     console.log(`Adding product ${product.id} to cart`);
//   };

//   const handleCategorySelect = (event) => {
//     const categoryId = event.target.value;
//     setSelectedCategory(categoryId);
//     fetchProducts(categoryId, selectedSize, selectedBrand);
//     fetchCategories(categoryId);
//   };

//   const handleSizeSelect = (event) => {
//     const size = event.target.value;
//     if (!size) {
//       setFilteredProducts(products);
//       return;
//     }
//     setSelectedSize(size);
//     const filtered = products.filter(product => product.taille === size);
//     setFilteredProducts(filtered);
//   };

//   const handleBrandSelect = (event) => {
//     const brand = event.target.value;
//     setSelectedBrand(brand);
//     if (!brand) {
//       setFilteredProducts(products);
//       setSizes([]);
//       return;
//     }
//     const filteredByBrand = products.filter(product => product.marque === brand);
//     setFilteredProducts(filteredByBrand);
//     const sizesForBrand = [...new Set(filteredByBrand.map(product => product.taille))];
//     setSizes(sizesForBrand);
//   };

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="products-container" style={{ direction: direction }}>
//       <div className="filters-section">
//         <div className="filter-section p-3 bg-light rounded shadow-sm">
//           <h4><FontAwesomeIcon icon={faFilter} /> {t('filters')}</h4>
//           <div className="mb-3">
//             <label className="form-label"><FontAwesomeIcon icon={faList} /> {t('categories')}</label>
//             <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
//               <option value="">{t('select_category')}</option>
//               {categories .map(category => (
//                 <option key={category.id} value={category.id}>{category.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-3">
//             <label className="form-label"><FontAwesomeIcon icon={faTag} /> {t('select_brand')}</label>
//             <select className="form-select" value={selectedBrand} onChange={handleBrandSelect}>
//               <option value="">{t('select_brand')}</option>
//               {brands.map(brand => (
//                 <option key={brand} value={brand}>{brand}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-3">
//             <label className="form-label"><FontAwesomeIcon icon={faRulerCombined} /> {t('select_size')}</label>
//             <select className="form-select" value={selectedSize} onChange={handleSizeSelect}>
//               <option value="">{t('select_size')}</option>
//               {sizes.map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       <div className="products-section">
//         <div className="text-center">
//           <h1 className="products-title">{t('produ')}</h1>
//           <div className="underline"></div>
//         </div>
//         <div className="row mt-4">
//           {currentProducts.map(product => (
//             <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
//               <ProductCard deal={product} updateCart={() => updateCart(product)} />
//             </div>
//           ))}
//         </div>
//         <Pagination>
//           <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
//           {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
//             <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
//               {i + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} />
//         </Pagination>
//       </div>
//     </div>
//   );
// }

// export default Products;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { getlang } from '../pages/Account/userStorageService';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [direction, setDirection] = useState('ltr');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === 'ar') {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
    fetchProducts();
    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    updateSizeAndBrandLists(filteredProducts);
  }, [filteredProducts]);

  const fetchProducts = (categoryId, size, brand) => {
    let url = 'http://localhost:8080/api/admin/products';
    if (categoryId) {
      url = `http://localhost:8080/api/admin/category/${categoryId}`;
    }
    let lang = getlang();
    axios.get(url, { params: { lang } })
      .then(response => {
        let filteredProducts = response.data;
        if (size) {
          filteredProducts = filteredProducts.filter(product => product.taille === size);
        }
        if (brand) {
          filteredProducts = filteredProducts.filter(product => product.marque === brand);
        }
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  };

  const fetchCategories = () => {
    const url = 'http://localhost:8080/api/admin/categories';
    const lang = getlang();
    axios.get(url, { params: { lang } })
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  };

  const updateSizeAndBrandLists = (products) => {
    const uniqueSizes = [...new Set(products.map(product => product.taille))];
    const uniqueBrands = [...new Set(products.map(product => product.marque))];
    setSizes(uniqueSizes);
    setBrands(uniqueBrands);
  };

  const updateCart = (product) => {
    console.log(`Adding product ${product.id} to cart`);
  };

  const handleCategorySelect = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, selectedSize, selectedBrand);
  };

  const handleSizeSelect = (event) => {
    const size = event.target.value;
    setSelectedSize(size);
    if (!size) {
      setFilteredProducts(products);
      updateSizeAndBrandLists(products);
      return;
    }
    const filtered = products.filter(product => product.taille === size);
    setFilteredProducts(filtered);
    const brandsForSize = [...new Set(filtered.map(product => product.marque))];
    setBrands(brandsForSize);
  };

  const handleBrandSelect = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    if (!brand) {
      setFilteredProducts(products);
      updateSizeAndBrandLists(products);
      return;
    }
    const filteredByBrand = products.filter(product => product.marque === brand);
    setFilteredProducts(filteredByBrand);
    const sizesForBrand = [...new Set(filteredByBrand.map(product => product.taille))];
    setSizes(sizesForBrand);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="products-container" style={{ direction: direction }}>
      <div className="filters-section">
        <div className="filter-section p-3 bg-light rounded shadow-sm">
          <h4><FontAwesomeIcon icon={faFilter} /> {t('filters')}</h4>
          <div className="mb-3">
            <label className="form-label"><FontAwesomeIcon icon={faList} /> {t('categories')}</label>
            <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
              <option value="">{t('select_category')}</option>
              {categories .map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label"><FontAwesomeIcon icon={faTag} /> {t('select_brand')}</label>
            <select className="form-select" value={selectedBrand} onChange={handleBrandSelect}>
              <option value="">{t('select_brand')}</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label"><FontAwesomeIcon icon={faRulerCombined} /> {t('select_size')}</label>
            <select className="form-select" value={selectedSize} onChange={handleSizeSelect}>
              <option value="">{t('select_size')}</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="products-section">
        <div className="text-center">
          <h1 className="products-title">{t('produ')}</h1>
          <div className="underline"></div>
        </div>
        <div className="row mt-4">
          {currentProducts.map(product => (
            <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
              <ProductCard deal={product} updateCart={() => updateCart(product)} />
            </div>
          ))}
        </div>
        <Pagination>
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
            <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} />
        </Pagination>
      </div>
    </div>
  );
}

export default Products;
