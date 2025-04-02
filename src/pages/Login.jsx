import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../store/reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import img_admin from './../data/login.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!isChecked) {
            toast.error("Please agree to the Terms and Conditions");
            return;
        }
        dispatch(admin_login(state));
    };

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: 'center'
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/admin/dashboard');
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    return (
        <div className="min-w-screen min-h-screen flex justify-center items-center bg-white">
            <div className="flex flex-row bg-white shadow-lg rounded-lg overflow-hidden w-4/5 max-w-3xl">
                {/* Left section for form */}
                <div className="w-1/2 p-8 bg-white">
                    <div className="text-left mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Yummy Bee</h2>
                        <p className="text-gray-600 mt-2">Welcome back to dashboard page</p>
                        <h3 className="text-4xl font-bold mt-4">Sign in</h3>
                    </div>
                    <form onSubmit={submit}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
                            <input
                                onChange={inputHandle}
                                value={state.email}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                id="email"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="password" className="text-gray-700 font-semibold flex justify-between">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    onChange={inputHandle}
                                    value={state.password}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    id="password"
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>

                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the Terms and Conditions
                            </label>
                        </div>
                        <button
                            disabled={loader}
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex justify-center items-center"
                        >
                            {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : 'SIGN IN'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-gray-600">Don't have an seller account?</p>
                        <Link to="/register" className="text-orange-500 hover:underline">
                            Create an Account
                        </Link>
                    </div>
                </div>

                {/* Right section for illustration */}
                <div className="flex w-1/2 bg-orange-50 justify-center items-center">
                    <img src={img_admin} alt="Admin Illustration" className="w-3/4 h-auto" />
                </div>
            </div>
        </div>
    );
};

export default Login;
