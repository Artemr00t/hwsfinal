import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/videos-repositories";

export const videosRouter = Router({})

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
enum QUALITY {
     P144 = 'P144',
     P240 = 'P240',
     P360 = 'P360',
     P480 = 'P480',
     P720 = 'P720',
     P1080 = 'P1080',
     P1440 = 'P1440',
     P2160 = 'P2160'
}

const validateString = (str: string, num:number) : boolean => !str || !str.trim() || str.length > num;
const validateNotBoolean = (value: any) : boolean => typeof value !== 'boolean';
const validateAge = (value: number) : boolean => value < 1 || value > 18;
const validateNotDate = (date: any) : boolean => typeof date !== 'string';
const validateQuality = (value: Array<string>) : boolean => {
    for (let i = 0; i < value.length; i++) {
        const qualityInArray = Object.values(QUALITY);
        let resolutionFind = false;
        for (let j = 0; j < qualityInArray.length; j++) {
            if (value[i] === qualityInArray[j]){
                resolutionFind = true;
            }
        }
        if (!resolutionFind){
            return true
        }
    }
    return false
}

videosRouter.get('/', (req:Request, res: Response) => {
    const videos = videosRepository.returnAllVideos();
    res.status(STATUS.OK_200).send(videos)
})
videosRouter.get('/:id', (req:Request, res: Response) => {
    const videoById = videosRepository.returnVideoById(+req.params.id)
    return videoById
        ? res.status(STATUS.OK_200).send(videoById)
        : res.sendStatus(STATUS.NOT_FOUND_404)
})
videosRouter.post('/', (req:Request, res: Response) => {
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
    if (validateQuality(availableResolutions)){
        errors.push({message: ERRORS_MESSAGES.availableResolutions_message, field: ERRORS_MESSAGES.availableResolutions_field})
    }
    if (errors.length > 0) return res.status(STATUS.BAD_REQUEST_400).send({errorsMessages: errors})

    const addVideo = videosRepository.addVideo(title, author, availableResolutions)
    res.status(STATUS.CREATE_201).send(addVideo);
})
videosRouter.put('/:id', (req:Request, res: Response) => {
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
        errors.push({message: ERRORS_MESSAGES.author_message, field: ERRORS_MESSAGES.author_field})
    }
    for (const i in availableResolutions) {
        if (availableResolutions[i].length > 5){
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
    if (errors.length > 0) return res.status(STATUS.BAD_REQUEST_400).send({errorsMessages: errors})

    const updateVideo = videosRepository.returnVideoById(+req.params.id)
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
videosRouter.delete('/:id', (req:Request, res: Response) => {
    const isVideoDeleted = videosRepository.removeVideoById(+req.params.id)
    isVideoDeleted
        ? res.sendStatus(STATUS.No_CONTENT_204)
        : res.sendStatus(STATUS.NOT_FOUND_404)
})