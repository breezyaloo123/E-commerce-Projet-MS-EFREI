import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
        <span className="product-cat-tag">{product.category}</span>
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <div className="product-rating">
            <Star size={14} fill="#eab308" color="#eab308" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <span className="product-price">{product.price.toFixed(2)} €</span>
          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={15} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
