import { Media } from "./media.interface.ts";

export interface PhotoResponse extends Media {
  photo: string;
}
