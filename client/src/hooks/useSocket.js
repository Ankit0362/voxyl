import { useEffect, useRef, useCallback, useState } from 'react'
import { io } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      setConnectionError(null)
    })

    socket.on('disconnect', () => setIsConnected(false))

    socket.on('connect_error', (err) => {
      setConnectionError(err.message)
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const joinPollRoom = useCallback((pollId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_poll_room', { pollId })
    }
  }, [])

  const leavePollRoom = useCallback((pollId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_poll_room', { pollId })
    }
  }, [])

  const onResponseUpdate = useCallback((callback) => {
    const socket = socketRef.current
    if (!socket) return () => {}
    socket.on('response_update', callback)
    return () => socket.off('response_update', callback)
  }, [])

  const onPollPublished = useCallback((callback) => {
    const socket = socketRef.current
    if (!socket) return () => {}
    socket.on('poll_published', callback)
    return () => socket.off('poll_published', callback)
  }, [])

  const onPollExpired = useCallback((callback) => {
    const socket = socketRef.current
    if (!socket) return () => {}
    socket.on('poll_expired', callback)
    return () => socket.off('poll_expired', callback)
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinPollRoom,
    leavePollRoom,
    onResponseUpdate,
    onPollPublished,
    onPollExpired
  }
}
