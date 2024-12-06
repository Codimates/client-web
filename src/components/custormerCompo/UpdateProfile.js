import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '../../context/UserContext'
import { toast } from 'react-hot-toast'
import { FaCamera, FaSave } from 'react-icons/fa'


export default function UpdateProfile({ onClose }) {
    // Get user context
    const { user, setUser } = useContext(UserContext);

    // State for form fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [address, setAddress] = useState('');

    // Populate form with existing user data when component mounts
    useEffect(() => {
        if (user) {
            setFname(user.fname || '');
            setLname(user.lname || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phone_number || '');
            setPreviewImage(user.image || '');
            setAddress(user.address || '');
        }
    }, [user]);

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger hidden file input
    const triggerFileInput = () => {
        document.getElementById('profile-image-input').click();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare update payload
            const updatePayload = {
                fname,
                lname,
                email,
                phone_number: phoneNumber,
                image: profileImage || previewImage,
                address
            };

            // Send update request
            const response = await axios.put(
                `user/updateuser/${user._id}`, 
                updatePayload, 
                { 
                    withCredentials: true 
                }
            );

            // Update context with new user data
            setUser(response.data.data);

            // Show success toast
            toast.success('Profile updated successfully!');

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Update failed', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!user) return <div>Loading...</div>;
    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Update Profile</h1>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                {/* Profile Image Upload */}
                <div className="relative flex flex-col items-center mb-6">
                    <div className="relative">
                        <img 
                            src={previewImage || '/default-avatar.png'} 
                            alt="Profile" 
                            className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full"
                        />
                        <input 
                            type="file" 
                            id="profile-image-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="absolute bottom-0 right-0 bg-[#19191A] text-white rounded-full p-2 hover:bg-opacity-80 transition"
                        >
                            <FaCamera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* First Name */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">First Name</label>
                    <input 
                        type="text" 
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#19191A]/30"
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Last Name</label>
                    <input 
                        type="text" 
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#19191A]/30"
                        required
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#19191A]/30"
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Phone Number</label>
                    <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#19191A]/30"
                        required
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Address</label>
                    <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#19191A]/30"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full p-2 text-white transition bg-[#19191A] rounded hover:bg-opacity-90 flex items-center justify-center"
                >
                    <FaSave className="mr-2" />
                    Update Profile
                </button>
            </form>
        </div>
    )
}