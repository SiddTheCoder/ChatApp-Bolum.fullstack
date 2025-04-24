export const getPrivateRoomId = (senderId, receiverId) => {
  return [senderId, receiverId].sort().join('-')
}