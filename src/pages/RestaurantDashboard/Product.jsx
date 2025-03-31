import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add_product, messageClear } from '../../store/reducers/productReducer'; 

const Product = () => {
    const dispatch = useDispatch();
    const productState = useSelector(state => state.product) || {};
    const { loader = false, successMessage = '', errorMessage = '' } = productState;

    const [productData, setProductData] = useState({
        name: "",
        //image: "",
        descriptions: "",
        price: 0,
        quantity: 0,
        is_available: true,
        is_draft: false
    });
    
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setProductData({
                ...productData,
                image: imageUrl
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        try {
            await dispatch(add_product(formData)).unwrap();
            setProductData({
                name: "",
                //image: "",
                descriptions: "",
                price: 0,
                quantity: 0,
                is_available: true,
                is_draft: false
            });
            setImageFile(null);
        } catch (error) {
            console.error("Failed to add product:", error);
        }
    };

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                dispatch(messageClear());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Add new product</h2>
            
            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
            {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
            
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
                    
                </div>
                
                <div className="flex justify-between w-full">
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full sm:w-auto px-8 py-4 text-center"
                        disabled={loader}
                    >
                        {loader ? 'Adding...' : 'Thêm sản phẩm'}
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
