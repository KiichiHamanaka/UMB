import React, {useEffect, useRef, useState} from 'react'
import ReactPlayer from 'react-player/youtube'
import {youtubeInfo} from '../types'

import io from "socket.io-client"

const socket = io('localhost:3001')

let videos: youtubeInfo[] = []
let currentTime = 0

const Player = () => {
    const playersRef = useRef<ReactPlayer>(null);
    const [videoURL, setVideoURL] = useState<string>('https://www.youtube.com/watch?v=FkVYHUMCCwc');
    const [playing, setPlaying] = useState<boolean>(true);
    const [duration, setDuration] = useState<number>(0);

    useEffect(()=>{
        seek(30)
    },[duration])

    const load = (url:any,num?:number) => {
        setVideoURL(url)
        seek(num)
    }

    const seek =(num:number) =>{
        playersRef.current.seekTo(num)
    }

    socket.on("getPlayList", (params: any) => {
        videos = [...params.videos]
        load(videos[0].videoURL)
    })
    socket.on("currentTime", (videoTime: number) => {
        currentTime = videoTime
        console.log(`server's playing ${currentTime}s`)
        setDuration(videoTime)
    })

    socket.emit('getPlayList', () => {})

    return (
        <div>
            <ReactPlayer
                ref={playersRef}
                url={videoURL}
                playing={playing}
            />
        </div>
    )
}

export default Player
