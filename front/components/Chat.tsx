import React, {useState} from 'react'

interface hogeProps {
    text:string
    author:string
}
const Chat = () => {
    const [msgList,setMsgList] = useState<Array<hogeProps>>([])

    //const hoge = (text:string,author:string) => {
    const hoge = () => {
        setMsgList([...msgList,{text:'aaa',author:'bbb'}])
    }

    const listItems = msgList.map((list) =>
            <>
                <li className="text">{list.text}</li>
                <li className="author">{list.author}</li>
            </>
    )
    return (
        <div>
            <ul>{listItems}</ul>
            <button onClick={hoge}></button>
        </div>
    )
}

export default Chat
