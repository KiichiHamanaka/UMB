import express from 'express'
import io, { Socket } from 'socket.io';
import {YoutubeDataAPI} from 'youtube-v3-api'
import {youtubeInfo} from './types'
import * as util from './util'

const app: express.Express = express()

// CORSの許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// GetとPostのルーティング
const router: express.Router = express.Router()
router.get('/api/getTest', (req:express.Request, res:express.Response) => {
    res.send(req.query)
})
router.post('/api/postTest', (req:express.Request, res:express.Response) => {
    res.send(req.body)
})
app.use(router)

const server = app.listen(3001,()=>{ console.log('Example app listening on port 3001!') })

const ws = new io.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    },
})

const API_KEY = "AIzaSyAcFfuw6JtPK-GkXlQtlRK0yEJgU9mfmRM"
const api = new YoutubeDataAPI(API_KEY)

let Toriaezu: Socket|null = null

const currentSonglist:youtubeInfo[] = [];

const list:youtubeInfo[] = [
    {
        videoId: "kt2D7xl06mk",
        videoURL: "https://www.youtube.com/watch?v=kt2D7xl06mk",
        songTitle: "VIDEO 11s",
        songArtist: "China",
        currentTime: 0
    },
    {
        videoId: "p1_bnT2PBsM",
        videoURL: "https://www.youtube.com/watch?v=p1_bnT2PBsM",
        songTitle: "video_28s",
        songArtist: "USA",
        currentTime: 0
    }
]

let startTime:Date,currentTime:Date
let videoEndTime:number = 0

/*
ロードして再生する関数
 */
const loadVideo = async (id:string) =>{
    console.log(`load ${id}`)
    const yt:any = await api.searchVideo(id)
    const duration = yt.items[0].contentDetails.duration
    videoEndTime = (util.cnvDuration(duration)) * 1000
    startTime = new Date()
}

/*
動画が再生されて何秒経ったか
 */
const getTime = ():number => {
    currentTime = new Date()
    let elapsedTime = Math.floor((currentTime.getTime()  - startTime.getTime() ) / 1000);
    return elapsedTime
}

/*
現在のプレイリスト
 */
const getPlayList = () => currentSonglist

const getAll = (socket: Socket) =>{
    socket.emit("getPlayList", {videos:getPlayList()});
    socket.emit("currentTime", getTime())
}

const startYoutube = async () => {
    currentSonglist.pop()
    if(!currentSonglist.length){
        const rnum = Math.floor(Math.random() * list.length)
        currentSonglist.push(list[rnum]) // TODO:APIで曲ランダムで取ってくるようにする
        console.log("曲追加")
    }
    await loadVideo(currentSonglist[0].videoId) //配列の最初のID
    await console.log(`動画時間は${videoEndTime/1000}秒です`)
    if(Toriaezu)getAll(Toriaezu) //苦肉の策
    await util.sleep(videoEndTime)
    console.log('Three seconds to next video.')
    await util.sleep(1000)
    console.log('Two seconds to next video.')
    await util.sleep(1000)
    console.log('One seconds to next video.')
    await util.sleep(1000)
    startYoutube()
}

ws.on('connection', (socket: Socket) => {
    console.log("New client connected")
    Toriaezu = socket
    // getAll(socket)
    socket.on("currentTime", ()=>{
        socket.emit("currentTime", getTime())
    })
    socket.on("getPlayList", ()=>{
         getAll(socket)
         console.log(getPlayList())
         console.log(`${socket.id} call me`)
    })
})

startYoutube()
// TODO:動画終了時に次の動画をロードする機能作成
// TODO: id,曲タイトル,アーティスト保持するテーブル作る
