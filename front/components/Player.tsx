import React, { useReducer, useState } from 'react'
import YouTube, { Options, } from 'react-youtube'
import { youtubeInfo } from '../types'
import { YouTubePlayer } from 'youtube-player/dist/types';

import io from "socket.io-client"
const socket = io('localhost:3001')

let videos: youtubeInfo[] = []
let currentTime = 0

const Player = () => {
  const [videoId, setVideoId] = useState('FkVYHUMCCwc');
  const [player, setPlayer] = useState(null)

  socket.on("getPlayList",(params:any)=>{
    videos = params.videos
    console.log(`playing now ${videos[0]}`)
    setVideoId(videos[0].videoId)
  })

  socket.on("currentTime", (videoTime:number)=>{
    currentTime = videoTime
    console.log(`server's playing ${currentTime}s`)
  });

  const reloadVideo = () => {
    socket.emit('currentTime', () => {})
    console.log(videos)
    player.seekTo(currentTime)
    player.unMute()
    player.playVideo()
  }

  const onReady = (event:{target: YouTubePlayer}) => {
    setPlayer(event)
  }

  const options = {
    height: '390',
    width: '640',
    playerVars: {
      start: currentTime,
      autoplay: 1,
      mute: 1,
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
      </div>
  )
}

export default Player
