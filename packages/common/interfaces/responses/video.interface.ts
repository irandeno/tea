import { Media } from "./media.interface.ts";

export interface VideoResponse extends Media {
  video: string;
}
