import {
  Controller,
  Hears,
  PhotoResponse,
  UpdateType,
  VideoResponse,
} from "../../packages/common/mod.ts";

@Controller({ updateTypes: [UpdateType.MESSAGE] })
export class AlbumController {
  @Hears("photo")
  photo(): PhotoResponse {
    return {
      photo:
        "https://media.wired.com/photos/5b899992404e112d2df1e94e/master/pass/trash2-01.jpg",
      caption: "fantasy photo",
    };
  }

  @Hears("video")
  video(): VideoResponse {
    return {
      video: "http://techslides.com/demos/sample-videos/small.mp4",
      caption: "amazing video",
    };
  }
}
