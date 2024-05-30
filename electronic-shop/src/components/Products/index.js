import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Adjust the path according to your file structure
// import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRulerCombined, faTag, faList } from '@fortawesome/free-solid-svg-icons';
// import '../../style.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
    if (!brand) {
      setFilteredProducts(products);
      return;
    }
    setSelectedBrand(brand);
    const filtered = products.filter(product => product.marque === brand);
    setFilteredProducts(filtered);
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-3">
          <div className="filter-section p-3 bg-light rounded shadow-sm">
            <h4><FontAwesomeIcon icon={faFilter} /> Filtres</h4>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faList} /> Catégorie</label>
              <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faTag} /> Marque</label>
              <select className="form-select" value={selectedBrand} onChange={handleBrandSelect}>
                <option value="">Sélectionner la marque</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faRulerCombined} /> Taille</label>
              <select className="form-select" value={selectedSize} onChange={handleSizeSelect}>
                <option value="">Sélectionner la taille</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="text-center">
            <h1 className="products-title">PRODUITS</h1>
            <div className="underline"></div>
          </div>
          <div className="row mt-4">
            {filteredProducts.map(product => (
              <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
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
