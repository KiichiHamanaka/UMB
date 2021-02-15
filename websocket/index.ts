import express from 'express'
import io, { Socket } from 'socket.io';
import * as youtube from './youtube'

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
});

ws.on('connection', (socket: Socket) => {
    console.log("New client connected")
    socket.emit("getPlayList", {videos:youtube.getPlayList()});
    socket.emit("currentTime", youtube.getTime())
    socket.on("currentTime", ()=>{
        socket.emit("currentTime", youtube.getTime())
    })
    socket.on("getPlayList", ()=>{
         socket.emit("getPlayList", {videos:youtube.getPlayList()});
         console.log(youtube.getPlayList())
         console.log(`${socket.id} call me`)
    });
});
youtube.startYoutube()
console.log(youtube.getPlayList())
