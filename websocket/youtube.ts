import {YoutubeDataAPI} from 'youtube-v3-api'
import {youtubeInfo} from './types/index'
import * as util from './util'

const API_KEY = "AIzaSyAcFfuw6JtPK-GkXlQtlRK0yEJgU9mfmRM"
const api = new YoutubeDataAPI(API_KEY);

export const currentSonglist:youtubeInfo[] = [];

const list:youtubeInfo[] = [
    {
        videoId: "kt2D7xl06mk",
        songTitle: "VIDEO 10s",
        songArtist: "China",
        currentTime: 0
    },
    {
        videoId: "p1_bnT2PBsM",
        songTitle: "video_20s",
        songArtist: "USA",
        currentTime: 0
    }
]

let startTime:Date,currentTime:Date
let videoEndTime:number = 0

/*再帰関数作ってそいつにロードさせる
* 再帰関数やめたほうがいい？上でロードさせる？
*/
export const startYoutube = async () => {
    currentSonglist.pop()
    if(!currentSonglist.length){
        const rnum = Math.floor(Math.random() * list.length)
        currentSonglist.push(list[rnum]) // TODO:APIで曲ランダムで取ってくるようにする
    }
    await loadVideo(currentSonglist[0].videoId) //配列の最初のID
    await console.log(`動画時間は${videoEndTime/1000}秒です`)
    setTimeout(startYoutube, videoEndTime)
}

/*
ロードして再生する関数
 */
const loadVideo = async (id:string) =>{
    console.log(`load ${id}`)
    const youtube:any = await api.searchVideo(id)
    const duration = youtube.items[0].contentDetails.duration
    videoEndTime = (util.cnvDuration(duration)) * 1000
    startTime = new Date()
}

/*
動画が再生されて何秒経ったか
 */
export const getTime = ():number => {
    currentTime = new Date()
    let elapsedTime = Math.floor((currentTime.getTime()  - startTime.getTime() ) / 1000);
    return elapsedTime
}

/*
現在のプレイリスト
 */
export const getPlayList = () => currentSonglist
