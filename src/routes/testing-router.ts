import {Request, Response, Router} from "express";
import {videosDb} from "./videos-router";

export const testingRouter = Router({})

enum STATUS {
    OK_200 = 200,
    CREATE_201 = 201,
    No_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}

testingRouter.delete('/', (req:Request, res: Response) => {
    videosDb.splice(0, videosDb.length)
    res.sendStatus(STATUS.No_CONTENT_204);
})