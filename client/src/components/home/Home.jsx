import React, { useEffect, useRef, useState } from 'react'
import Conversation from '../conversation/Conversation'
import classes from "./home.module.css"
import Woman from '../../assets/woman.jpg'
import Message from '../message/Message'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const Home = () => {

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [lastConvoClicked, setLastConvoClicked] = useState('')
  const [otherUser, setOtherUser] = useState('')
  const { user, token } = useSelector((state) => state.auth)
  const socket = useRef()
  const [comingMessage, setComingMessage] = useState("")

   
  useEffect(() => {
    socket.current = io("ws://localhost:8080");
    socket.current.on("getMessage", (data) => {
      console.log(data)
      setComingMessage({
        senderId: data.senderId,
        messageText: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user._id]);

  useEffect(() => {
    comingMessage &&
      lastConvoClicked?.members.includes(comingMessage.senderId) &&
      setMessages((prev) => [...prev, comingMessage]);
  }, [comingMessage, lastConvoClicked]);

  useEffect(() => {
    const fetchUserConvos = async () => {
      try {
        const res = await fetch (`http://localhost:4000/conversation/find/${user._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const convos = await res.json()
        setConversations((prev) => convos)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUserConvos()
  }, [user._id])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/message/${lastConvoClicked._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await res.json()
        setMessages((prev) => data)
      } catch (error) {
        console.error(error.message)
      }
    }
    lastConvoClicked && fetchMessages()
  },[lastConvoClicked])

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const otherUserId = lastConvoClicked?.members?.find((member) => member !== user._id)
        const res = await fetch(`http://localhost:4000/user/find/${otherUserId}`)
        const data = await res.json()
        setOtherUser((prev) => data)
      } catch (error) {
        console.error(error)
      }
    }
    lastConvoClicked && fetchOtherUser()
  }, [lastConvoClicked])

  

  const handlePostMessage = async() => {
    try {
      const res = await fetch(`http://localhost:4000/message`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({conversationId: lastConvoClicked._id, messageText: message})
      })
      const data = await res.json()
      setMessages((prev) => [...prev, data])

      const otherUserId = lastConvoClicked?.members?.find((member) => member !== user._id)

      socket.current.emit("sendMessage", {
        senderId: user._id,
        otherUserId,
        text: message
      });

      setMessage('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h2 className={classes.title}>Chat App</h2>
          {conversations?.map((c) => (
            <div key={c._id} onClick={() => setLastConvoClicked(c)}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
        <div className={classes.right}>
          {otherUser ? 
            <>
              <div className={classes.otherUserData}>
                <img src={Woman} className={classes.otherUserImg} />
                <h4 className={classes.personUsername}>{otherUser?.username}</h4>
              </div>
              <div className={classes.messages}>
                {messages?.length > 0 ? messages?.map((message) => (
                  <Message messages={messages} key={message._id} own={message.senderId === user._id} message={message} />
                )) : <h1 style={{textAlign: 'center', color: '#fff'}}>No messages yet, be the first one to send!</h1>}
              </div>
            </>
            : (
              <h1 style={{textAlign: 'center', marginTop: '2rem', color: '#fff'}}>Click a conversation!</h1>
            )
          }
          <div className={classes.inputAndBtn}>
            <input value={message} onChange={(e) => setMessage(prev => e.target.value)} className={classes.input} type="text" placeholder='Type message...' />
            <button onClick={handlePostMessage} className={classes.submitBtn}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
