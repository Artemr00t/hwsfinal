import express, {Request, Response} from "express";
import { addDays } from 'date-fns'

const app = express()
const port = process.env.PORT || 1488
app.use(express.json())

enum STATUS {
    OK_200 = 200,
    CREATE_201 = 201,
    No_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}
enum ERRORS_MESSAGES {
    title_message = 'Invalid title',
    title_field = 'title',

    author_message = 'Invalid author',
    author_field = "author",

    availableResolutions_message = 'Invalid availableResolutions',
    availableResolutions_field = 'availableResolutions',

    canBeDownloaded_message = 'Invalid canBeDownloaded',
    canBeDownloaded_field = 'canBeDownloaded',

    minAgeRestriction_message = 'Invalid minAgeRestriction',
    minAgeRestriction_field = 'minAgeRestriction',

    publicationDate_message = 'Invalid publicationDate',
    publicationDate_field = 'publicationDate',
}

const validateString = (str: string, num:number) => !str || !str.trim() || str.length > num;
const validateNotBoolean = (value: any) => typeof value !== 'boolean';
const validateAge = (value: number) => value < 1 || value > 18;
const validateNotDate = (date: any) => typeof date !== 'string';

type VideosDbType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null
    createdAt: string
    publicationDate: string
    availableResolutions: Array<string>
}
let videosDb: VideosDbType[] = []

app.get('/', (req:Request, res: Response) => {
    res.send('Hello World!')
})
app.get('/videos', (req:Request, res: Response) => {
    res.status(STATUS.OK_200).send(videosDb)
})
app.get('/videos/:id', (req:Request, res: Response) => {
    const videoById = videosDb.find(v => v.id === +req.params.id)
    return videoById
        ? res.status(STATUS.OK_200).send(videoById)
        : res.sendStatus(STATUS.NOT_FOUND_404)
})
app.post('/videos', (req:Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions

    let errors = []
    if (validateString(title, 40)){
        errors.push({message: ERRORS_MESSAGES.title_message, field: ERRORS_MESSAGES.title_field})
    }
    if (validateString(author, 20)){
        errors.push({message: ERRORS_MESSAGES.author_message, field: ERRORS_MESSAGES.author_field})
    }
    for (const i in availableResolutions) {
        if (availableResolutions[i].length > 5){
            errors.push({message: ERRORS_MESSAGES.availableResolutions_message, field: ERRORS_MESSAGES.availableResolutions_field})
        }
    }
    if (errors.length > 0) return res.status(STATUS.BAD_REQUEST_400).send({errorsMessages: errors})

    const dateNow = new Date();
    const createNewVideo = {
        id: +dateNow,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: dateNow.toISOString(),
        publicationDate: addDays(dateNow, 1).toISOString(),
        availableResolutions
    }
    videosDb.push(createNewVideo);
    res.status(STATUS.CREATE_201).send(createNewVideo);
})
app.put('/videos/:id', (req:Request, res: Response) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;

    let errors = []
    if (validateString(title, 40)){
        errors.push({message: ERRORS_MESSAGES.title_message, field: ERRORS_MESSAGES.title_field})
    }
    if (validateString(author, 20)){
        errors.push({message: ERRORS_MESSAGES.title_message, field: ERRORS_MESSAGES.author_field})
    }
    for (const i in availableResolutions) {
        if (availableResolutions[i].length > 0){
            errors.push({message: ERRORS_MESSAGES.availableResolutions_message, field: ERRORS_MESSAGES.availableResolutions_field})
        }
    }
    if (validateNotBoolean(canBeDownloaded)){
        errors.push({message: ERRORS_MESSAGES.canBeDownloaded_message, field: ERRORS_MESSAGES.canBeDownloaded_field})
    }
    if (validateAge(minAgeRestriction)){
        errors.push({message: ERRORS_MESSAGES.minAgeRestriction_message, field: ERRORS_MESSAGES.minAgeRestriction_field})
    }
    if (validateNotDate(publicationDate)){
        errors.push({message: ERRORS_MESSAGES.publicationDate_message, field: ERRORS_MESSAGES.publicationDate_field})
    }
    if (errors.length > 0) return res.status(STATUS.BAD_REQUEST_400).send({messagesErrors: errors})

    const updateVideo = videosDb.find(v => v.id === +req.params.id)
    return updateVideo
        ? (
            updateVideo.title = title,
                updateVideo.author = author,
                updateVideo.availableResolutions = availableResolutions,
                updateVideo.canBeDownloaded = canBeDownloaded,
                updateVideo.minAgeRestriction = minAgeRestriction,
                updateVideo.publicationDate = publicationDate,
                res.status(STATUS.No_CONTENT_204).send(updateVideo)
        )
        : res.sendStatus(STATUS.NOT_FOUND_404)
})
app.delete('/testing/all-data', (req:Request, res: Response) => {
    videosDb = [];
    res.sendStatus(STATUS.No_CONTENT_204);
})
app.delete('/videos/:id', (req:Request, res: Response) => {
    for (let i = 0; i < videosDb.length; i++) {
        if (videosDb[i].id === +req.params.id){
            videosDb.splice(i, 1);
            res.sendStatus(STATUS.No_CONTENT_204);
        }
    }
    res.sendStatus(STATUS.NOT_FOUND_404);
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})