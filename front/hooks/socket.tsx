import React, {useReducer} from 'react'
import ReactPlayer from 'react-player/youtube'
import {youtubeInfo} from '../types'

import io from "socket.io-client"

const socket = io('localhost:3001')

let videos: youtubeInfo[] = []
let currentTime = 0

const Socket = () => {
    useReducer(reducer, initialState)
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
}

export default Socket
