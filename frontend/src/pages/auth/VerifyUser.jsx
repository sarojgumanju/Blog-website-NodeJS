import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

const VerifyUser = () => {
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function verifyUser() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/verify-email/${verificationToken}`
                );
                toast.success(res.data.message);
                navigate("/signin");
            } catch (error) {
                toast.error(error.response.data.message);
            }
            
        }
        verifyUser();
    }, [verificationToken]);

  return (
    <div className='flex justify-center text-3xl font-bold'>
      User Verified
    </div>
  )
}

export default VerifyUser
