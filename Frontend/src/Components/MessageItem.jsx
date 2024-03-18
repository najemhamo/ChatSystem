import { useContext, useEffect, useState } from "react"
import { UserContext } from "../HomePage"

export default function MessageItem(props)
{
    const {message} = props
    const {users} = useContext(UserContext)
    const user = users[message.userId - 1]

    return (
    <>
        <div>
            <p>{message && message.messageText} {user && user.userName}</p>
        </div>
    </>
    )
}