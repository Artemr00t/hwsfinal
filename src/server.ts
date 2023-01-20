import express, {Request, Response} from "express";
import {videosRouter} from "./routes/videos-router";
import {testingRouter} from "./routes/testing-router";

const app = express()
const port = process.env.PORT || 1488
app.use(express.json())


app.get('/', (req:Request, res: Response) => {
    res.send('Hello World!')
})
app.use('/videos', videosRouter)
app.use('/testing/all-data', testingRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})