import { useState, useEffect, useReducer } from "react";
import { FaShoppingCart, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import logo from './assets/shoe_logo.png'; // Adjust path if needed
import './getData.css';

// Reducer function for cart state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    
    case 'REMOVE_ITEM':
      const itemToRemove = state.find(item => item.id === action.payload);
      if (itemToRemove.quantity > 1) {
        return state.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const GetData = ({ title, fetchData }) => {
    const [posts, setPosts] = useState([]);
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [showCart, setShowCart] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    

    useEffect(() => {
        fetchData().then(data => setPosts(data));
    }, [fetchData]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const openProductModal = (product) => {
      setSelectedProduct(product);
    };

    const closeProductModal = () => {
      setSelectedProduct(null);
    };

    return (
        <div className="data-container">
            <div className="cart-header">
                {/* Logo on the left */}
                <div className="logo-container">
                <img src={logo} alt="NXTSTEP Logo" className="logo" />
                </div>
                <h2 className="section-title">{title}</h2>

                {/* Cart icon on the right */}
                <div className="cart-icon" onClick={() => setShowCart(!showCart)}>
                    <FaShoppingCart />
                    {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </div>
            </div>

            {showCart && (
                <div className="cart-summary">
                    <h3>Your Cart ({totalItems} items)</h3>
                    <div className="cart-items">
                        {cart.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <>
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.avatar} alt={item.shoes_name} />
                                        <div className="cart-item-details">
                                            <span>{item.shoes_name}</span>
                                            <div className="quantity-controls">
                                                <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                                                    <FaMinus />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}>
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="cart-total">
                                    <strong>Total: ${totalPrice.toFixed(2)}</strong>
                                    <button 
                                      className="clear-cart"
                                      onClick={() => dispatch({ type: 'CLEAR_CART' })}
                                    >
                                      Clear Cart
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="product-modal">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeProductModal}>
                            <FaTimes />
                        </button>
                        <img src={selectedProduct.img_des} alt={selectedProduct.shoes_name} className="modal-image" />
                        <div className="modal-description">
                            <h3>{selectedProduct.shoes_name}</h3>
                            <p>{selectedProduct.short_origin}</p>
                            <div className="modal-footer">
                                <button 
                                    className="add-to-cart"
                                    onClick={() => {
                                        dispatch({ type: 'ADD_ITEM', payload: selectedProduct });
                                        closeProductModal();
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="cards-grid">
                {posts.map((post) => (
                    <div 
                        key={post.id} 
                        className="card"
                        onMouseEnter={() => setHoveredCard(post.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <img 
                            src={post.avatar} 
                            alt={post.shoes_name} 
                            onClick={() => openProductModal(post)}
                            className="product-image"
                        />
                        <div className="card-content">
                            <div className="name-price-container">
                                <h2 className="shoe-name">{post.shoes_name}</h2>
                                <p className="description">{post.description}</p>
                            </div>
                                
                            <span className="price">${post.price}</span>
                            {hoveredCard === post.id && (
                                <button 
                                    className="add-to-cart"
                                    onClick={() => dispatch({ type: 'ADD_ITEM', payload: post })}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};