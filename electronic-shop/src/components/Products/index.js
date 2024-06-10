// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProductCard from './ProductCard'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilter, faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';
// import './productStyle.css';
// import { useTranslation } from 'react-i18next';

// function Products() {
//   const [t, i18n] = useTranslation();
//   const [direction, setDirection] = useState('ltr');
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedBrand, setSelectedBrand] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

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

//   const fetchProducts = () => {
//     setLoading(true);
//     const url = 'http://localhost:8080/api/admin/products';
//     const lang = localStorage.getItem("Lang") || 'fr'; // Récupération de la langue depuis localStorage

//     axios.get(url, { params: { lang } })
//       .then(response => {
//         setProducts(response.data);
//         setFilteredProducts(response.data);
//       })
//       .catch(error => {
//         setError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const fetchCategories = (categoryId) => {
//     const url = categoryId
//       ? `http://localhost:8080/api/admin/${categoryId}/subcategories`
//       : 'http://localhost:8080/api/admin';

//     axios.get(url)
//       .then(response => {
//         setCategories(response.data);
//       })
//       .catch(error => {
//         setError(error);
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
//     const filtered = products.filter(product => product.taille === +size);
//     setFilteredProducts(filtered);
//   };

//   const handleBrandSelect = (event) => {
//     const brand = event.target.value;
//     setSelectedBrand(brand);
  
//     if (!brand) {
//       setFilteredProducts(products);
//       return;
//     }
  
//     const filteredByBrand = products.filter(product => product.marque === brand);
//     setFilteredProducts(filteredByBrand);
  
//     const sizesForBrand = [...new Set(filteredByBrand.map(product => product.taille))];
//     setSizes(sizesForBrand);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="container my-4" style={{ direction: direction }}>
//       <div className="row">
//         <div className="col-md-3">
//           <div className="filter-section p-3 bg-light rounded shadow-sm">
//             <h4><FontAwesomeIcon icon={faFilter} /> {t('filters')}</h4>
//             <div className="mb-3">
//               <label className="form-label"><FontAwesomeIcon icon={faList} /> {t('categories')}</label>
//               <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
//                 <option value="">{t('select_category')}</option>
//                 {categories.map(category => (
//                   <option key={category.id} value={category.id}>{category.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label"><FontAwesomeIcon icon={faTag} /> {t('select_brand')}</label>
//               <select className="form-select" value={selectedBrand} onChange={handleBrandSelect}>
//                 <option value="">{t('select_brand')}</option>
//                 {brands.map(brand => (
//                   <option key={brand} value={brand}>{brand}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label"><FontAwesomeIcon icon={faRulerCombined} /> {t('select_size')}</label>
//               <select className="form-select" value={selectedSize} onChange={handleSizeSelect}>
//                 <option value="">{t('select_size')}</option>
//                 {sizes.map(size => (
//                   <option key={size} value={size}>{size}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-9">
//           <div className="text-center">
//             <h1 className="products-title">{t('products')}</h1>
//             <div className="underline"></div>
//           </div>
//           <div className="row mt-4">
//             {filteredProducts.map(product => (
//               <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
//                 <ProductCard deal={product} updateCart={() => updateCart(product)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Products;









import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Ajustez le chemin selon votre structure de fichiers
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [direction, setDirection] = useState('ltr'); // Ajout de la variable direction

  const { t, i18n } = useTranslation(); // Utilisez useTranslation pour obtenir la fonction de traduction t

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
    if (!selectedSize && !selectedBrand) {
      updateSizeAndBrandLists(products);
    }
  }, [products]);

  const fetchProducts = (categoryId, size, brand) => {
    let url = 'http://localhost:8080/api/admin/products';
    if (categoryId) {
      url = `http://localhost:8080/api/admin/category/${categoryId}`;
    }

    axios.get(url)
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

  const fetchCategories = (categoryId) => {
    const url = categoryId
      ? `http://localhost:8080/api/admin/${categoryId}/subcategories`
      : 'http://localhost:8080/api/admin';

    axios.get(url)
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
    fetchCategories(categoryId);
  };

  const handleSizeSelect = (event) => {
    const size = event.target.value;
    if (!size) {
      setFilteredProducts(products);
      return;
    }
    setSelectedSize(size);
    const filtered = products.filter(product => product.taille === +size);
    setFilteredProducts(filtered);
  };

  const handleBrandSelect = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    if (!brand) {
      setFilteredProducts(products);
      setSizes([]);
      return; // Placer le retour ici pour sortir de la fonction
    }
    const filteredByBrand = products.filter(product => product.marque === brand);
    setFilteredProducts(filteredByBrand);
    const sizesForBrand = [...new Set(filteredByBrand.map(product => product.taille))];
    setSizes(sizesForBrand);
  };

  return (
    <div className="container my-4" style={{ direction: direction }}>
      <div className="row">
        <div className="col-md-3">
          <div className="filter-section p-3 bg-light rounded shadow-sm">
            <h4><FontAwesomeIcon icon={faFilter} /> {t('filters')}</h4>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faList} /> {t('categories')}</label>
              <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
                <option value="">{t('select_category')}</option>
                {categories.map(category => (
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
        <div className="col-md-9">
          <div className="text-center">
            <h1 className="products-title">{t('products')}</h1>
            <div className="underline"></div>
          </div>
          <div className="row mt-4">
            {filteredProducts.map(product => (
              <div className="  col-md-4 col-sm-6 mb-4" key={product.id}>
                <ProductCard deal={product} updateCart={() => updateCart(product)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

