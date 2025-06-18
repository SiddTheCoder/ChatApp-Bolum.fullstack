import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const options = {
  user: {
    text: 'User/Profile Setting',
    target : 'profile'
  },
  profile: {
    text: 'User/Profile Setting',
    target : 'profile'
  },
  account: {
    text: 'Account Setting',
     target : 'account'
  }
}

function Setting({handleOutletState}) {
  const navigate = useNavigate()
  const [searchedText, setSearchedText] = useState('')
  const [matchedOption, setMatchedOption] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const key = searchedText.trim().toLowerCase()

    // Match against keys in lowercase
    const foundKey = Object.keys(options).find(
      (optKey) => optKey.toLowerCase() === key
    )

    if (foundKey) {
      setMatchedOption(options[foundKey])
    } else {
      setMatchedOption('')
      setTimeout(() => {
        setSearchedText('')
        setMatchedOption(null)
      }, 2000);
    }
  }

  const handleClickOnMathcedText = (matchedOption) => {
    navigate(`/settings/${matchedOption.target}`)
    handleOutletState()
    setMatchedOption(null)
  }

  return (
    <div className='h-full w-full bg-slate-200/40 flex flex-col items-center'>
      <div>
        <form onSubmit={handleSubmit} className='flex items-center bg-amber-200 relative top-5'>
          <input
            type="text"
            placeholder='Search Settings'
            value={searchedText}
            onChange={(e) => setSearchedText(e.target.value)}
            name="userSearch"
            id="userSearch"
            className='h-10 bg-white p-2 rounded-md border sm:w-96  sm:active:w-[400px] transition-all duration-150 ease-in'
          />
          <button type='submit'>
            <Search size={25} className='absolute right-3 top-2 hover:scale-110 cursor-pointer transition-all duration-75 ease-in bg-slate-300 rounded-full p-1' />
          </button>
        </form>
      </div>

      {matchedOption && (
        <div className='absolute top-16 z-10 w-[500px] h-auto min-h-[150px] rounded-md bg-slate-300/30 shadow-amber-500 p-4'>
          <div onClick={() => handleClickOnMathcedText(matchedOption)} className='w-full p-1 text-sm font-semibold hover:bg-white cursor-pointer'>{matchedOption.text}</div>
        </div>
      )}
      {matchedOption == '' && (
        <div className='absolute top-16 z-10 w-[500px] h-auto min-h-[150px] rounded-md bg-slate-300/30 shadow-amber-500 p-4'>
          <div className='w-full p-1 text-sm font-semibold hover:bg-white cursor-pointer'>No Match Found</div>
        </div>
      )}
    </div>
  )
}

export default Setting
