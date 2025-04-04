import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_driver, messageClear } from '../store/reducers/driverReducer';
import toast from 'react-hot-toast';

const DetailShipper = () => {

    const dispatch = useDispatch();
    const { driver, successMessage, errorMessage, loader } = useSelector(state => state.driver);
    const { shipperId } = useParams();

    useEffect(() => {
        if (shipperId) {
            console.log("Dispatching get_restaurant with ID:", shipperId);
            dispatch(get_driver(shipperId)); 
        }
    }, [dispatch, shipperId]);

    const [status, setStatus] = useState('');

    // Hiển thị thông báo khi có successMessage hoặc errorMessage
    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());  
        } 
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    // Khi restaurant thay đổi, cập nhật status
    useEffect(() => { 
        if (driver) { 
            setStatus(driver?.status || '');
        } 
    }, [driver]);

    const submit = (e) => {
        e.preventDefault();
        // Thực hiện cập nhật trạng thái nhà hàng (nếu cần thêm action)
        console.log("Cập nhật trạng thái:", status);
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'>Shipper Details</h1>

            {/* Hiển thị loading */}
            {loader && <p className="text-center text-blue-500">Đang tải dữ liệu...</p>}

            <div className='w-full p-4 bg-[#b1addf] rounded-md'>

                <div className='w-full flex flex-wrap text-[#000000]'>

                    {/* Ảnh nhà hàng */}
                    <div className='w-3/12 flex justify-center items-center py-3'>
                        <div>
                            {driver?.image ? (
                                <img className='w-full h-[230px]' src={driver.image} alt={driver.name} />
                            ) : (
                                <span>Image Not Uploaded</span>
                            )}
                        </div> 
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className='w-4/12'>
                        <div className='px-0 md:px-5 py-2'>
                            <h2 className='py-2 text-lg'>Basic Info</h2>
                            <div className='flex flex-col gap-2 p-4 bg-[#b1addf] rounded-md'>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Name:</span>
                                    <span>{driver?.name || "N/A"}</span> 
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Time Opening:</span>
                                    <span>{driver?.opening_hours || "N/A"}</span> 
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Description:</span>
                                    <span>{driver?.description || "N/A"}</span> 
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Phone Number:</span>
                                    <span>{driver?.phone_number || "N/A"}</span> 
                                </div>
                            </div> 
                        </div> 
                    </div>

                    {/* Chi tiết nhà hàng */}
                    <div className='w-4/12'>
                        <div className='px-0 md:px-5 py-2'>
                            <h2 className='py-2 text-lg'>Details</h2>
                            <div className='flex flex-col gap-2 p-4 bg-[#b1addf] rounded-md'>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Address:</span>
                                    <span>{driver?.address || "N/A"}</span> 
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Status:</span>
                                    <span>{driver?.status || "N/A"}</span> 
                                </div>
                            </div> 
                        </div> 
                    </div>
                </div> 

                {/* Form cập nhật trạng thái */}
                <div> 
                    <form onSubmit={submit}>
                        <div className='flex gap-4 py-3'>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)} 
                                className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#b1addf] border border-slate-700 rounded-md text-[#000000]' 
                                required
                            >
                                <option value="">--Select Status--</option>
                                <option value="active">active</option>
                                <option value="deactive">pending</option>
                            </select>
                            <button type="submit" className='bg-red-500 w-[170px] hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2'>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div> 
        </div>
    );
};

export default DetailShipper;