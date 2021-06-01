import {
  Command,
  Controller,
  Hears,
  Param,
  UpdateType,
} from "../../packages/common/mod.ts";
import { MoviesService } from "./movies.service.ts";

@Controller({ updateTypes: [UpdateType.MESSAGE] })
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Command("all")
  getAll() {
    const movies = this.moviesService.getAll();
    const keyboard = this.moviesService.generateKeyboard(movies);
    return { message: "movies list : ", keyboard };
  }

  @Hears("{movie:string}")
  search(@Param("movie") movie: string) {
    const movies = this.moviesService.search(movie);
    const keyboard = this.moviesService.generateKeyboard(movies);
    return { message: "your search result : ", keyboard };
  }
}
