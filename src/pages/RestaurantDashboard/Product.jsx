import React, { useState } from 'react';

const Product = () => {
    const [productData, setProductData] = useState({
        name: "",
        image: "",
        descriptions: "",
        price: 0,
        quantity: 0,
        is_available: true,
        is_draft: false
    });
    
    // Thêm state để lưu file ảnh
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    // Xử lý khi chọn file ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            // Tạo URL tạm thời để preview ảnh
            const imageUrl = URL.createObjectURL(file);
            setProductData({
                ...productData,
                image: imageUrl
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Tạo FormData để gửi lên server (nếu cần)
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('descriptions', productData.descriptions);
        formData.append('price', productData.price);
        formData.append('quantity', productData.quantity);
        formData.append('is_available', productData.is_available);
        formData.append('is_draft', productData.is_draft);
        
        // Thêm file ảnh vào formData
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        console.log("Form data ready to submit:", productData);
        console.log("Image file:", imageFile);
        
        // Phần xử lý backend sẽ được thực hiện ở đây
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Add new product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
                <div className="mb-6 w-full">
                    <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-900">Tên sản phẩm</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 h-14"
                        placeholder="Enter name product" 
                        required 
                    />
                </div>
                
                <div className="mb-6 w-full">
                    <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-900">Hình ảnh sản phẩm</label>
                    <input 
                        type="file" 
                        id="image" 
                        name="image"
                        onChange={handleImageChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 h-14"
                        accept="image/*"
                        required 
                    />
                    {productData.image && (
                        <div className="mt-4">
                            <img 
                                src={productData.image} 
                                alt="Preview" 
                                className="max-h-64 max-w-full h-auto object-contain rounded-lg border"
                                onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Preview"}
                            />
                        </div>
                    )}
                </div>
                
                <div className="mb-6 w-full">
                    <label htmlFor="descriptions" className="block mb-2 text-lg font-medium text-gray-900">Mô tả</label>
                    <textarea 
                        id="descriptions" 
                        name="descriptions"
                        value={productData.descriptions}
                        onChange={handleChange}
                        rows="6" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
                        placeholder="Món cơm đến từ vùng provip."
                    ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="mb-6">
                        <label htmlFor="price" className="block mb-2 text-lg font-medium text-gray-900">Giá (VNĐ)</label>
                        <input 
                            type="number" 
                            id="price" 
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 h-14"
                            placeholder="40000" 
                            min="0"
                            required 
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="quantity" className="block mb-2 text-lg font-medium text-gray-900">Số lượng</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            name="quantity"
                            value={productData.quantity}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 h-14"
                            placeholder="10" 
                            min="0"
                            required 
                        />
                    </div>
                </div>
                
                <div className="flex justify-start mb-6 w-full">
                    <div className="flex items-center mr-8">
                        <input 
                            id="is_available" 
                            type="checkbox" 
                            name="is_available"
                            checked={productData.is_available}
                            onChange={handleChange}
                            className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                        />
                        <label htmlFor="is_available" className="ms-3 text-lg font-medium text-gray-900">Có sẵn</label>
                    </div>
                    
                    <div className="flex items-center">
                        <input 
                            id="is_draft" 
                            type="checkbox" 
                            name="is_draft"
                            checked={productData.is_draft}
                            onChange={handleChange}
                            className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                        />
                        <label htmlFor="is_draft" className="ms-3 text-lg font-medium text-gray-900">Bản nháp</label>
                    </div>
                </div>
                
                <div className="flex justify-between w-full">
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-8 py-4 text-center"
                    >
                        Thêm sản phẩm
                    </button>
                    
                    <button 
                        type="button" 
                        className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg w-full sm:w-auto px-8 py-4 text-center"
                        onClick={() => {
                            setProductData({
                                name: "",
                                image: "",
                                descriptions: "",
                                price: 0,
                                quantity: 0,
                                is_available: true,
                                is_draft: false
                            });
                            setImageFile(null);
                        }}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Product;
