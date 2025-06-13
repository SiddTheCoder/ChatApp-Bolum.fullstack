import React from 'react'

function Confirmer({ confirmatoryText, action, onClose }) {

  const [isActionOccuring, setIsActionOccuring] = React.useState(false)

  const handleClickOnConfirm = async() => {
    setIsActionOccuring(true)
    await action();
    setIsActionOccuring(false)
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-center text-black">{confirmatoryText}</h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleClickOnConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            {isActionOccuring ? 'Droping...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Confirmer
