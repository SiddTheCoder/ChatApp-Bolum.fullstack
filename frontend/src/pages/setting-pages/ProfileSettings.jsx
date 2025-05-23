import React, { useEffect, useState, useRef } from 'react';
import PageBacker from '../../components/semi-components/PageBacker';
import axios from 'axios';

const ProfileSettings = () => {
  const inputFiles = useRef(null);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    email: '',
    socialHandles: ['', ''],
    bio: '',
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (index, value) => {
    const newSocials = [...formData.socialHandles];
    newSocials[index] = value;
    setFormData((prev) => ({
      ...prev,
      socialHandles: newSocials,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let width = img.width;
          let height = img.height;
          const maxSize = 1024;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.8;
          let compressedDataURL = canvas.toDataURL('image/jpeg', quality);
          while (compressedDataURL.length > 200 * 1024 && quality > 0.2) {
            quality -= 0.1;
            compressedDataURL = canvas.toDataURL('image/jpeg', quality);
          }

          setFormData((prev) => ({ ...prev, avatar: compressedDataURL }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserById = async () => {
    try {
      const response = await axios.get('/api/v1/user/get-user-by-id', { withCredentials: true });
      setUser(response.data?.data);
      setFormData((prev) => ({
        ...prev,
        fullname: response.data?.data?.fullname || '',
        username: response.data?.data?.username || '',
        email: response.data?.data?.email || '',
        avatar: response.data?.data?.avatar || null,
        bio: response.data?.data?.bio || '',
      }));
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('hgb',formData); 
  };

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <>
      <div className=""><PageBacker className={'ml-5'} /></div>

      <form onSubmit={handleFormSubmit} className="min-h-[95vh] bg-gray-200 flex flex-col md:flex-row justify-center items-start p-6 gap-6">
        
        {/* Left Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-80 flex flex-col items-center text-center">
          <img
            src={formData?.avatar}
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover mb-4"
          />
          <h2 className="text-lg font-semibold">{user?.fullname}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>

          <label className="cursor-pointer bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 relative">
            Upload New Photo
            <input
              type="file"
              className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
              accept="image/*"
              ref={inputFiles}
              onChange={handleImageChange}
            />
          </label>

          <div className="text-sm text-gray-600 mt-3 p-2 bg-gray-100 rounded">
            <p>Upload a new avatar. Larger image will be resized automatically.</p>
            <p><strong>Maximum upload size is 1 MB</strong></p>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Member Since: <strong>{new Date(user?.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</strong>
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full md:flex-1">
          <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
          <div className="border-b mb-6">
            <ul className="flex gap-4">
              <li className="border-b-2 border-blue-500 pb-2 font-medium">User Info</li>
              <li className="text-gray-400 cursor-not-allowed">Billing Information</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="fullname"
                onChange={handleInputChange}
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={formData.fullname}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                name="username"
                onChange={handleInputChange}
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={formData.username}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                onChange={handleInputChange}
                type="password"
                className="mt-1 w-full p-2 border rounded"
                placeholder="**********"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className="mt-1 w-full p-2 border rounded"
                placeholder="**********"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                name="email"
                onChange={handleInputChange}
                type="email"
                className="mt-1 w-full p-2 border rounded"
                value={formData.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm Email Address</label>
              <input
                type="email"
                className="mt-1 w-full p-2 border rounded"
                value={formData.email}
              />
            </div>

            {/* Social Handles */}
            <div>
              <label className="block text-sm font-medium sm:flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-4 h-4" alt="Facebook" />
                Facebook Username
              </label>
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                placeholder="Facebook Username"
                value={formData.socialHandles[0]}
                onChange={(e) => handleSocialChange(0, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium sm:flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-4 h-4" alt="Twitter" />
                Twitter Username
              </label>
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                placeholder="Twitter Username"
                value={formData.socialHandles[1]}
                onChange={(e) => handleSocialChange(1, e.target.value)}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
                Update Info
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileSettings;
