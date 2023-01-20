import {addDays} from "date-fns";

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
export let videosDb: VideosDbType[] = []

export const videosRepository = {
    returnAllVideos() : Array<VideosDbType> {
        return videosDb;
    },
    returnVideoById(id: number) : VideosDbType | undefined {
        return videosDb.find(v => v.id === id)
    },
    addVideo(title : string, author : string, availableResolutions : Array<string>) : VideosDbType {
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
        videosDb.push(createNewVideo)
        return createNewVideo
    },
    removeVideoById(id: number) : boolean {
        for (let i = 0; i < videosDb.length; i++) {
            if (videosDb[i].id === id){
                videosDb.splice(i, 1);
                return true
            }
        }
        return false
    }
};
