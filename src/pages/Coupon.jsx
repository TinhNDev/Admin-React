import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create_coupon, messageClear } from '../store/reducers/couponReducer';
import toast from 'react-hot-toast';

const Coupon = ({ onClose }) => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.coupon);
    const { userInfo } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        coupon_name: '',
        coupon_code: '',
        discount_value: '',
        discount_type: 'PERCENTAGE',
        max_discount_amount: '',
        min_order_value: '',
        max_uses_per_user: '',
        start_date: '',
        end_date: '',
        is_active: true,
        coupon_type: 'ONE_TIME'
    });

    // Monitor notifications from Redux store
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            onClose && onClose();
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, onClose]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        // Check required fields
        if (!formData.coupon_name) {
            toast.error('Please enter the coupon name');
            return false;
        }
        if (!formData.coupon_code) {
            toast.error('Please enter the coupon code');
            return false;
        }
        if (!formData.discount_value) {
            toast.error('Please enter the discount value');
            return false;
        }
        if (parseFloat(formData.discount_value) <= 0) {
            toast.error('Discount value must be greater than 0');
            return false;
        }
        if (!formData.start_date) {
            toast.error('Please select a start date');
            return false;
        }
        if (!formData.end_date) {
            toast.error('Please select an end date');
            return false;
        }

        // Check start and end dates
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        const currentDate = new Date();

        if (startDate < currentDate) {
            toast.error('Start date must be from the current date onwards');
            return false;
        }
        if (endDate <= startDate) {
            toast.error('End date must be after the start date');
            return false;
        }

        // Check numeric values
        if (formData.max_discount_amount && parseFloat(formData.max_discount_amount) <= 0) {
            toast.error('Maximum discount amount must be greater than 0');
            return false;
        }
        if (formData.min_order_value && parseFloat(formData.min_order_value) <= 0) {
            toast.error('Minimum order value must be greater than 0');
            return false;
        }
        if (formData.max_uses_per_user && parseInt(formData.max_uses_per_user) <= 0) {
            toast.error('Maximum uses per user must be greater than 0');
            return false;
        }

        // Check percentage value
        if (formData.discount_type === 'PERCENTAGE' && parseFloat(formData.discount_value) > 100) {
            toast.error('Percentage discount value cannot exceed 100%');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Check authentication
        const token = localStorage.getItem("userToken");
        const adminId = userInfo?.user_id || localStorage.getItem("adminId");

        if (!token || !adminId) {
            toast.error("You need to log in again to perform this function");
            return;
        }

        // Convert numeric values
        const body = {
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : undefined,
            min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : undefined,
            max_uses_per_user: formData.max_uses_per_user ? parseInt(formData.max_uses_per_user) : undefined,
        };

        // Call create_coupon action
        dispatch(create_coupon({ body }));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full mx-0">
            <h2 className="text-3xl font-bold mb-8 text-left">Create New Coupon</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coupon name */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="coupon_name">
                            Coupon name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="coupon_name"
                            name="coupon_name"
                            value={formData.coupon_name}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter coupon name"
                            required
                        />
                    </div>

                    {/* Coupon code */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="coupon_code">
                            Coupon code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="coupon_code"
                            name="coupon_code"
                            value={formData.coupon_code}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter coupon code (e.g. SUMMER2023)"
                            required
                        />
                    </div>

                    {/* Discount type */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="discount_type">
                            Discount type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="discount_type"
                            name="discount_type"
                            value={formData.discount_type}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED_AMOUNT">Fixed amount (VND)</option>
                        </select>
                    </div>

                    {/* Discount value */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="discount_value">
                            Discount value <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="discount_value"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={formData.discount_type === 'PERCENTAGE' ? "Enter discount percentage" : "Enter discount amount"}
                            min="0"
                            step={formData.discount_type === 'PERCENTAGE' ? "0.1" : "1000"}
                            required
                        />
                        <small className="text-gray-500 text-base block mt-2">
                            {formData.discount_type === 'PERCENTAGE' ? 'Value from 0-100%' : 'Discount amount (VND)'}
                        </small>
                    </div>

                    {/* Maximum discount amount */}
                    {formData.discount_type === 'PERCENTAGE' && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="max_discount_amount">
                                Maximum discount amount
                            </label>
                            <input
                                type="number"
                                id="max_discount_amount"
                                name="max_discount_amount"
                                value={formData.max_discount_amount}
                                onChange={handleChange}
                                className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter maximum discount amount"
                                min="0"
                                step="1000"
                            />
                            <small className="text-gray-500 text-base block mt-2">Leave blank if no limit</small>
                        </div>
                    )}

                    {/* Minimum order value */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="min_order_value">
                            Minimum order value
                        </label>
                        <input
                            type="number"
                            id="min_order_value"
                            name="min_order_value"
                            value={formData.min_order_value}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter minimum order value"
                            min="0"
                            step="1000"
                        />
                        <small className="text-gray-500 text-base block mt-2">Leave blank if no minimum requirement</small>
                    </div>

                    {/* Maximum uses per user */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="max_uses_per_user">
                            Maximum uses per user
                        </label>
                        <input
                            type="number"
                            id="max_uses_per_user"
                            name="max_uses_per_user"
                            value={formData.max_uses_per_user}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter maximum uses"
                            min="1"
                            step="1"
                        />
                        <small className="text-gray-500 text-base block mt-2">Leave blank if no limit</small>
                    </div>



                    {/* Coupon type */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="coupon_type">
                            Coupon type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="coupon_type"
                            name="coupon_type"
                            value={formData.coupon_type}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="ONE_TIME">One-time use</option>
                            <option value="ONE_TIME_EVERY_DAY">Once per day</option>
                        </select>
                    </div>
                     {/* Start date */}
                     <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="start_date">
                            Start date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* End date */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-xl font-medium mb-3" htmlFor="end_date">
                            End date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full px-5 py-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                    {/* Active status */}
                    <div className="mb-6">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="form-checkbox h-7 w-7 text-blue-600"
                            />
                            <span className="text-gray-700 text-xl font-medium">Activate immediately</span>
                        </label>
                    </div>

                {/* Submit button */}
                <div className="flex justify-start mt-8">
                    <button
                        type="submit"
                        className="px-8 py-4 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={loader}
                    >
                        {loader ? (
                            <span className="flex items-center justify-center">
                                Processing...
                            </span>
                        ) : (
                            'Create coupon'
                        )}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default Coupon;
