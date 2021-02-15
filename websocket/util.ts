/*
youtubeAPI
Data型からnumber型に
秒数変換用
 */
export const cnvDuration = (input:string):number =>{
    const reg = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
    let hours = 0, minutes = 0, seconds = 0, totalseconds = 0
    if (reg.test(input)) {
        const matches:any = reg.exec(input)
        if (matches[1]) hours = Number(matches[1])
        if (matches[2]) minutes = Number(matches[2])
        if (matches[3]) seconds = Number(matches[3])
        totalseconds = hours * 3600  + minutes * 60 + seconds
    }
    return totalseconds
}
