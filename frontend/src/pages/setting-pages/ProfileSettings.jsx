import React from 'react'
import PageBacker from '../../components/semi-components/PageBacker';

const ProfileSettings = () => {

  return (
    <>
      <div className=''><PageBacker className={'ml-5'} /></div>
      <div className="min-h-[95vh] bg-gray-200 flex flex-col md:flex-row justify-center items-start p-6 gap-6">
      {/* Left Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-80 flex flex-col items-center text-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover mb-4"
        />
        <h2 className="text-lg font-semibold">Jamed Allan</h2>
        <p className="text-sm text-gray-500">@james</p>

        <button className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600">
          Upload New Photo
        </button>

        <div className="text-sm text-gray-600 mt-3 p-2 bg-gray-100 rounded">
          <p>Upload a new avatar. Larger image will be resized automatically.</p>
          <p><strong>Maximum upload size is 1 MB</strong></p>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Member Since: <strong>29 September 2019</strong>
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

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" className="mt-1 w-full p-2 border rounded" defaultValue="James" />
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input type="text" className="mt-1 w-full p-2 border rounded" defaultValue="Allan" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full p-2 border rounded" defaultValue="**********" />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input type="password" className="mt-1 w-full p-2 border rounded" defaultValue="**********" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input type="email" className="mt-1 w-full p-2 border rounded" defaultValue="demomail@mail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Email Address</label>
            <input type="email" className="mt-1 w-full p-2 border rounded" defaultValue="demomail@mail.com" />
          </div>

          {/* Social Profiles */}
          <div>
            <label className="block text-sm font-medium sm:flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-4 h-4" alt="Facebook" />
              Facebook Username
            </label>
            <input type="text" className="mt-1 w-full p-2 border rounded" placeholder="Facebook Username" />
          </div>
          <div>
            <label className="block text-sm font-medium sm:flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" className="w-4 h-4" alt="Twitter" />
              Twitter Username
            </label>
            <input type="text" className="mt-1 w-full p-2 border rounded" placeholder="Twitter Username" />
          </div>

          {/* Button */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
              Update info
            </button>
          </div>
        </form>
      </div>
    </div>
    </> 
  );
};

export default ProfileSettings
