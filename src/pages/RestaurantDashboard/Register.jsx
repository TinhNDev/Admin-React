import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { seller_register, messageClear } from '../../store/reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import {Link , useNavigate } from 'react-router-dom';
import img_register from '../../data/register.png';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector((state) => state.auth);

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
        dispatch(seller_register({ ...state, role: 'seller' }));
    };
    

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/login');
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    return (
        <div className="min-w-screen min-h-screen flex justify-center items-center bg-white">
            <div className="flex flex-row bg-white shadow-lg rounded-lg overflow-hidden w-4/5 max-w-3xl">
                {/* Left section for form */}
                <div className="w-1/2 p-8 bg-white">
                    <div className="text-left mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Yummy Bee</h2>
                        <p className="text-gray-600 mt-2">Create a new seller account</p>
                        <h3 className="text-4xl font-bold mt-4">Sign Up</h3>
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
                            <label htmlFor="password" className="text-gray-700 font-semibold">Password</label>
                            <input
                                onChange={inputHandle}
                                value={state.password}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                id="password"
                                required
                            />
                        </div>
                        <button
                            disabled={loader}
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex justify-center items-center"
                        >
                            {loader ? <PropagateLoader color="#fff" /> : 'SIGN UP'}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-gray-600">Already have an account?</p>
                        <Link to="/login" className="text-orange-500 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Right section for illustration */}
                <div className="flex w-1/2 bg-orange-50 justify-center items-center">
                    <img src={img_register} alt="Register Illustration" className="w-3/4 h-auto" />
                </div>
            </div>
        </div>
    );
};

export default Register;
