import express from 'express'
import * as youtube from './youtube'

const app: express.Express = express()

app.get("/", (req, res) =>{
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(3002,()=> console.log)
youtube.startYoutube()
