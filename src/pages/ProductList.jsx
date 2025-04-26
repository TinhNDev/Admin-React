import React from "react";
import { FaTag } from "react-icons/fa";

const ProductList = ({ products }) => {
  return (
    <div className="space-y-6">
      {products.map((category) => (
        <div
          key={category.category_id}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              {category.category_name}
            </h3>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.product_name}
                      className="w-full h-48 object-cover"
                    />
                    {product.is_flash_sale === 1 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaTag size={12} />
                        Flash Sale
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {product.product_name}
                    </h4>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.product_description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-orange-500 font-medium">
                          {product.product_price.toLocaleString()}₫
                        </span>
                        {product.is_flash_sale === 1 && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {product.original_price.toLocaleString()}₫
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        Còn {product.product_quantity} sản phẩm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
