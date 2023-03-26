import React, { useEffect, useState } from 'react'
import classes from "./conversation.module.css"
import Woman from '../../assets/woman.jpg'

const Conversation = ({conversation, currentUser }) => {
  const [otherUser, setOtherUser] = useState('')

  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUserId = conversation.members.find((member) => member != currentUser._id)
      const res = await fetch(`http://localhost:4000/user/find/${otherUserId}`)
      const data = await res.json()
      setOtherUser(prev => data)
    }
    conversation && fetchOtherUser()
  }, [conversation])

  console.log(otherUser)

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={Woman} className={classes.personImg} />
        <div className={classes.metaData}>
          <div className={classes.otherUsername}>{otherUser.username}</div>
          <div className={classes.lastMsgConvo}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse sint debitis nisi consectetur odit culpa, accusantium necessitatibus itaque rem dolor iusto. Dolorum officia rerum corporis, eaque excepturi a iusto illum!</div>
        </div>
      </div>
    </div>
  )
}

export default Conversation
