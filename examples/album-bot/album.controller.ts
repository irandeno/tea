import {
  Controller,
  Hears,
  PhotoResponse,
  UpdateType,
} from "../../packages/common/mod.ts";

@Controller({ updateTypes: [UpdateType.MESSAGE] })
export class AlbumController {
  @Hears("photo")
  photo(): PhotoResponse {
    return {
      photo:
        "https://media.wired.com/photos/5b899992404e112d2df1e94e/master/pass/trash2-01.jpg",
      caption: "test",
    };
  }
}
