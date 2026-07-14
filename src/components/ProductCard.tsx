// src/components/ProductCard.tsx
import React from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  price?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, price }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        width: "250px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      )}
      <h3 style={{ marginTop: "12px", fontSize: "18px" }}>{product.name}</h3>
      {product.description && (
        <p style={{ fontSize: "14px", color: "#555" }}>{product.description}</p>
      )}
      {price !== undefined ? (
        <p style={{ fontWeight: "bold", color: "#0070f3" }}>
          Prix: {price} $
        </p>
      ) : (
        <p style={{ fontStyle: "italic", color: "#999" }}>
          Prix non défini
        </p>
      )}
    </div>
  );
};

export default ProductCard;
