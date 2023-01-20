import {Request, Response, Router} from "express";

export const testingRouter = Router({})

enum STATUS {
    OK_200 = 200,
    CREATE_201 = 201,
    No_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}

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

testingRouter.delete('/', (req:Request, res: Response) => {
    videosDb = [];
    res.sendStatus(STATUS.No_CONTENT_204);
})