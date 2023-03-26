import React, { useEffect, useRef } from 'react'
import classes from "./message.module.css"
import Woman from '../../assets/woman.jpg'
import {format} from "timeago.js"

const Message = ({messages, own, message}) => {

  const ref = useRef();

  useEffect(() => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
    {!own && 
    <div ref={ref} className={classes.container}>
      <div className={classes.wrapper}>
        <img src={Woman}  className={classes.personImg}/>
        <div className={classes.messageAndTimeAgo}>
          <div className={classes.text}>{message.messageText}</div>
          <span className={classes.timeAgo}>{format(message.createdAt)}</span>
        </div>
      </div>
    </div>
    }
    {own && 
    <div ref={ref} className={`${classes.container} ${classes.own}`}>
      <div className={classes.wrapper}>
        <div className={classes.messageAndTimeAgo}>
          <div className={classes.text}>{message.messageText}</div>
          <span className={classes.timeAgo}>{format(message.createdAt)}</span>
        </div>
        <img src={Woman}  className={classes.personImg}/>
      </div>
    </div>
    }
    </>
  )
}

export default Message
