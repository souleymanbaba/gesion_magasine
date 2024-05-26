import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Adjust the path according to your file structure
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style.css';

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
    // Fetch initial list of products
    fetchProducts();
    // Fetch initial categories
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update size and brand lists whenever products change
    if(!selectedSize && !selectedBrand)
     updateSizeAndBrandLists(products);
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
    if(!size) {setFilteredProducts(products); return}
    setSelectedSize(size);
    const filtered = products.filter(product => product.taille === +size);
    setFilteredProducts(filtered);
  };

  const handleBrandSelect = (event) => {
    const brand = event.target.value;
    if(!brand) {setFilteredProducts(products); return}

    setSelectedBrand(brand);
    const filered = products.filter(product => product.marque === brand)
    setFilteredProducts(filered);

  
  };

  return (
    <div className="container" id="product-cards">
      <div className="row">
        <div className="col-md-3">
          <h2>Filters</h2>
          <select className="form-select mb-3" value={selectedSize} onChange={handleSizeSelect}>
            <option value="">Select Size</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <select className="form-select mb-3" value={selectedBrand} onChange={handleBrandSelect}>
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <select className="form-select scrolling-list" value={selectedCategory} onChange={handleCategorySelect}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">PRODUCTS</h1>
          <div className="row" style={{ marginTop: '30px' }}>
            {filteredProducts.map(product => (
              <div className="col-md-3 py-3 py-md-0" key={product.id}>
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
