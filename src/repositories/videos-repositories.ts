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
    addVideo(video : VideosDbType) : VideosDbType[] {
        videosDb.push(video)
        return videosDb.slice(-1)
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
