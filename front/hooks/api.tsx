import React, { useReducer, useState } from 'react'
import YouTube, { Options, } from 'react-youtube'
import { youtubeInfo } from '../types'

import io from "socket.io-client"
const socket = io('localhost:3001')

let videos: youtubeInfo[] = []
let currentTime = 0

const Player = async () => {
    const [videoId, setVideoId] = useState('FkVYHUMCCwc');
    const [player, setPlayer] = useState(null)

    socket.on("getPlayList",(params:any)=>{
        if(player===null)
            videos = [...params.videos]
        setVideoId(videos[0].videoId)
    })

    socket.on("currentTime", (videoTime:number)=>{
        currentTime = videoTime
        console.log(`server's playing ${currentTime}s`)
        player.seekTo(currentTime)
        player.unMute()
        player.playVideo()
    })

    const reloadVideo = () => {
        socket.emit('getPlayList', () => {}) // 更新かかるよりも早く下のが動く
        socket.emit('currentTime', () => {}) // 更新かかるよりも早く下のが動く
        console.log(videos)
    }

    // const onReady = (event:{target: YouTubePlayer}) => {
    //   setPlayer(event)
    // }

    const onReady = (event:any) => {
        setPlayer(event.target)
    }

    const options = {
        height: '390',
        width: '640',
        playerVars: {
            start: currentTime,
            autoplay: 1,
        }
    } as Options

    return (
        <div>
            <YouTube
                videoId={videoId}
                opts={options}
                onReady={onReady}
                onPause={reloadVideo}
            />
            <button type="button" onClick={() => socket.emit("currentTime", () => {})}></button>
        </div>
    )
}
// TODO: DOMのロードより先にsetPlayerが呼ばれる問題をなんとかする
export default Player
