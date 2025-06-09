import React,{useState} from 'react'
import PageBacker from '../../components/semi-components/PageBacker'
import { Users, StarHalf, UserRoundX, FileUser, UserLock, UserRoundMinus, UserX } from 'lucide-react'
import Confirmer from '../../components/Confirmer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AccountSettings() {
  const navigate = useNavigate()
  const [isDeleteAccountProceed, setIsDeleteAccountProceed] = useState(false)
  const [showConfirm, setShowConfirm] = useState(null)

  const logoutUser = async () => {
    try {
      const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/user/logout-user', { withCredentials: true })
      navigate('/')
    } catch (error) {
      console.log('error occured while Logouting the user account',error)
    }
  }

  const deleteUserAccount = async () => {
    try {
      const response = await axios.post('https://chatapp-bolum-backend.onrender.com/api/v1/user/delete-user-account',{}, { withCredentials: true })
      navigate('/')
    } catch (error) {
      console.log('error occured while deleting the user account',error)
    }
  }

  return (
    <>
      <div className=''><PageBacker className={'ml-5'} /></div>
      <div className='h-[95vh] w-full bg-slate-400/20 flex'>
        
        <div className='h-full w-[60%] flex flex-col py-7 px-2'>
          <div className='border-b-2 border-green-600'><span className='text-green-800 text-xl font-semibold'>Safe Zone</span>
          </div>
          <div className='flex flex-col h-full relative'>
            <div className='flex bg-slate-300/20 hover:bg-slate-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 transition-all duration-150 ease-in cursor-pointer'><Users size={16} />Freinds</div>
            <div className='flex bg-slate-300/20 hover:bg-slate-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 transition-all duration-150 ease-in cursor-pointer'><StarHalf size={16} />Star Friends</div>
            <div className='flex bg-slate-300/20 hover:bg-slate-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 transition-all duration-150 ease-in cursor-pointer'><UserRoundX size={16} />Blocked Freinds</div>
            <div className='flex bg-slate-300/20 hover:bg-slate-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 transition-all duration-150 ease-in cursor-pointer'><FileUser size={16} />Account Status</div>
            <div className='flex bg-slate-300/20 hover:bg-slate-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 transition-all duration-150 ease-in cursor-pointer'><UserLock size={16} />Account Privacy Policy</div>
            <div
              onClick={() => setShowConfirm('logout')}
              className='flex absolute bottom-0 bg-slate-300/30 hover:bg-purple-400/30 h-10 items-center px-1 hover:px-5 gap-1 hover:gap-3 rounded-3xl transition-all duration-150 ease-in cursor-pointer'>
              <UserRoundMinus size={16} />Logout
            </div>
            {showConfirm === 'logout' && (
                <Confirmer
                  confirmatoryText="Are you sure you want to Logout ?"
                  action={logoutUser}
                  onClose={() => setShowConfirm(false)}
                />
            )}
          </div>
        </div>

        <div className='h-full w-5 flex justify-center items-center'><div className='h-[90%] w-2 border-l-4 border-purple-500 rounded-2xl'></div></div>

          {/* ------------------------------------------------------ */}
        <div className='h-full w-[40%] flex flex-col py-7 px-2'>
          <div className='border-b-2 border-red-600'><span className='text-red-800 text-xl font-semibold'>Danger Zone</span>
          </div>
          <div className='flex flex-col h-full relative'>
            <div>
              <span className='text-sm'>
                Deleting your account is permanent and will result in the loss of all your account data, including messages, friends, and settings. This action cannot be undone.
              </span>
              <div className='text-right text-sm'>
                <span onClick={() => setIsDeleteAccountProceed(prev => !prev)} className='hover:underline bg-slate-600/10 px-5 py-2 cursor-pointer rounded-md'>{ isDeleteAccountProceed ? 'Dont Want to Proceed ?' : 'Want to Proceed ?'}</span>
              </div>
            </div>
            {isDeleteAccountProceed && <div onClick={() => setShowConfirm('deleteAccount')} className='flex absolute bottom-0 bg-red-300/40 px-4 hover:bg-red-700 hover:text-white h-10 items-center hover:px-5 gap-1 hover:gap-3 rounded-3xl transition-all duration-150 ease-in cursor-pointer'><UserX size={16} />Delete Account</div>}
          </div>
        </div>
      </div>

      {showConfirm === 'deleteAccount' && (
        <Confirmer
          confirmatoryText="Are you sure you want to delete this Account ?"
          action={deleteUserAccount}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}

export default AccountSettings
