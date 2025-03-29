import ffmpeg from "fluent-ffmpeg";

export const getVideoDuration = (videoPath) => {
    return new Promise ((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, function (err, metadata) {
            if (err) {
              // If an error occurs, reject the Promise with an error message
              console.log(err)
              reject("Error extracting video duration");
            } else {
              // If successful, resolve the Promise with the duration of the video
              resolve(metadata.format.duration);
            }
          })
    })
}