import {YoutubeDataAPI} from 'youtube-v3-api'
import {youtubeInfo} from './types/index'

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
        videoId: "FkVYHUMCCwc",
        songTitle: "DESU",
        songArtist: "Suiseiseki",
        currentTime: 0
    }
]

let startTime:Date,currentTime:Date
let videoEndTime = 0

//再帰関数作ってそいつにロードさせる

export const startYoutube = async () => {
    currentSonglist.pop()

    if(!currentSonglist.length){
        const rnum = Math.floor(Math.random() * list.length)
        currentSonglist.push(list[rnum]) //曲ランダム追加
    }
    await loadVideo(currentSonglist[0].videoId) //配列の最初のID
    await console.log(`動画時間は${videoEndTime/1000}秒です`)
    setTimeout(startYoutube,videoEndTime)
}

/*
ロードして再生する関数
 */
const loadVideo = async (id:string) =>{
    console.log(`load ${id}`)
    await api.searchVideo(id).then((data:any) => {
        console.log(data)
        const duration = data.items[0].contentDetails.duration
        videoEndTime = (cnvDuration(duration)+5) * 1000
        startTime = new Date()
    })
}

/*
URLをリスト形式にコンバートしてDBにupする関数
 */

const wait = () => {
    setTimeout(() => {
        console.log('Timeout');
    }, (videoEndTime+8)*1000);
}

/*
youtubeAPI秒数変換用
 */
const cnvDuration = (input:string):number =>{
    const reg = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
    let hours = 0, minutes = 0, seconds = 0, totalseconds = 0
    if (reg.test(input)) {
        const matches:any = reg.exec(input)
        if (matches[1]) hours = Number(matches[1])
        if (matches[2]) minutes = Number(matches[2])
        if (matches[3]) seconds = Number(matches[3])
        totalseconds = hours * 3600  + minutes * 60 + seconds
    }
    return totalseconds
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

/*
DBからランダムで追加
 */
export const nextSong = (hoge:youtubeInfo) => {
    currentSonglist.splice(0)
    currentSonglist.push(hoge)
}
