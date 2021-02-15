import React, { useReducer, useState } from 'react'
import YouTube, { Options } from 'react-youtube'
import { youtubeInfo } from '../types'
import io from "socket.io-client"
const socket = io('localhost:3001')

// type ACTIONTYPE =
//   | { type: 'addVideo'; payload: youtubeInfo }
//   | { type: 'removeVideo'; payload: youtubeInfo }

let videos: youtubeInfo[] = []
let currentTime = 0
// const reducer = (
//   state: typeof videos,
//   action: ACTIONTYPE
// ): youtubeInfo[] => {
//   switch (action.type) {
//     case 'addVideo':
//       return [
//         ...videos,
//         {
//           videoId: 'XxVg_s8xAms',
//           songTitle: 'cat',
//           songArtist: 'human',
//           currentTime: 0
//         }
//       ]
//     case 'removeVideo':
//       return [
//         ...videos,
//         {
//           videoId: 'XxVg_s8xAms',
//           songTitle: 'cat',
//           songArtist: 'human',
//           currentTime: 0
//         }
//       ]
//     default:
//       throw new Error()
//   }
// }

const Player = () => {
  const [videoId, setVideoId] = useState('FkVYHUMCCwc');
  const [player, setPlayer] = useState(null)
  // const [video, setVideo] = useReducer(reducer, videos)

  socket.on("hello", (msg:object)=>{
    console.log(msg)
  });

  socket.on("getPlayList",(params:any)=>{
    videos = params.videos
    console.log(params.videos)
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

  const onReady = async (event:any) => {
    setPlayer(event.target)
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
