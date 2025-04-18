    import React, { useEffect, useState } from 'react'; 
    import { useDispatch, useSelector } from 'react-redux';
    import { useParams, useNavigate } from 'react-router-dom';
    import { get_driver, messageClear, change_shipper_status, get_allDriver } from '../store/reducers/driverReducer';
    import toast from 'react-hot-toast';

    const DetailShipper = () => {
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const { driver, successMessage, errorMessage, loader } = useSelector(state => state.driver);
        const { shipperId } = useParams();

        // Lấy dữ liệu shipper khi component mount
        useEffect(() => {
            if (shipperId) {
                console.log("Dispatching get_driver with ID:", shipperId);
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

        // Khi driver thay đổi, cập nhật status
        useEffect(() => { 
            if (driver?.status) { 
                console.log("Cập nhật status:", driver.status);
                setStatus(driver.status);
            } 
        }, [driver]);

        // Xử lý cập nhật trạng thái
        const submit = (e) => {
            e.preventDefault();

            if (!shipperId) {
                toast.error("Không tìm thấy ID shipper.");
                return;
            }

            if (status === driver.status) {
                toast.error("Shipper đang ở trạng thái này.");
                return;
            }

            dispatch(change_shipper_status({ driverId: shipperId, status }))
                .then(() => {
                    toast.success("Cập nhật trạng thái thành công!");
                    closeOverlayAndRefresh();
                })
                .catch(() => {
                    toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
                });
        };
        
        // Đóng overlay, quay lại trang danh sách và refresh dữ liệu
        const closeOverlayAndRefresh = () => {
            // Dispatch action để tải lại danh sách shipper
            const currentParams = JSON.parse(sessionStorage.getItem('driverListParams') || '{}');
            dispatch(get_allDriver(currentParams));
            
            // Quay lại trang danh sách
            navigate('/admin/shipper');
        };

        // Đóng overlay và quay lại trang danh sách
        const closeOverlay = () => {
            closeOverlayAndRefresh();
        };

        // Cleanup khi component unmount
        useEffect(() => {
            return () => {
                // Khi component unmount, tải lại danh sách shipper
                const currentParams = JSON.parse(sessionStorage.getItem('driverListParams') || '{}');
                dispatch(get_allDriver(currentParams));
            };
        }, []);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h1 className='text-[20px] font-bold'>Shipper Details</h1>
                        <button 
                            onClick={closeOverlay}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Hiển thị loading */}
                    {loader && <p className="text-center text-blue-500 py-4">Đang tải dữ liệu...</p>}

                    <div className='p-4 bg-white'>
                        <div className='w-full flex flex-col md:flex-row gap-4'>
                            {/* Ảnh shipper */}
                            <div className='md:w-1/3'>
                                {driver?.image ? (
                                    <img className='w-full h-auto rounded-md' src={driver.image} alt={driver.name} />
                                ) : (
                                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
                                        <span>Image Not Uploaded</span>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin shipper */}
                            <div className='md:w-2/3'>
                                <div className='bg-[#f8f9fa] p-4 rounded-md mb-4'>
                                    <h2 className="text-lg font-semibold mb-2 text-center">Basic Info</h2>
                                    <div className='grid grid-cols-1 gap-2'>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">Name:</span>
                                            <span>{driver?.Profile.name || "N/A"}</span> 
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">Phone Number:</span>
                                            <span>{driver?.Profile.phone_number || "N/A"}</span> 
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">Car Name:</span>
                                            <span>{driver?.car_name || "N/A"}</span> 
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">Number car:</span>
                                            <span>{driver?.cavet || "N/A"}</span> 
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">CCCD Back:</span>
                                            <span>{driver?.cccdBack || "N/A"}</span> 
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="font-bold">CCCD Front:</span>
                                            <span>{driver?.cccdFront || "N/A"}</span> 
                                        </div>
                                    </div>
                                </div>

                                {/* Form cập nhật trạng thái */}
                                <form onSubmit={submit}>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="px-4 py-2 focus:border-indigo-500 outline-none bg-white border border-slate-300 rounded-md"
                                            required
                                        >
                                            <option value="">--Select Status--</option>
                                            <option value="active">BUSY</option>
                                            <option value="pending">ONLINE</option>
                                            <option value="pending">PROCESSING</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                                        >
                                            Update Status
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default DetailShipper;
