import {
  CallbackQuery,
  Command,
  Controller,
  Hears,
  Param,
  UpdateType,
} from "../../packages/common/mod.ts";
import { MoviesService } from "./movies.service.ts";

@Controller({ updateTypes: [UpdateType.MESSAGE, UpdateType.CALLBACK_QUERY] })
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @CallbackQuery("{name:string}")
  getByName(@Param("name") name: string) {
    const movie = this.moviesService.getByName(name);
    if (movie === undefined) {
      return "movie not found";
    }
    return {
      message:
        `name: ${movie.name}\ndate: ${movie.date}\nscore: ${movie.score}`,
    };
  }

  @Command("all")
  getAll() {
    const movies = this.moviesService.getAll();
    const keyboard = this.moviesService.generateKeyboard(movies);
    return { message: "movies list : ", keyboard };
  }

  @Hears("{movie:string}")
  search(@Param("movie") movie: string) {
    const movies = this.moviesService.search(movie);
    if (movies.length === 0) {
      return "no movie found, send /all to see list of movies";
    }
    const keyboard = this.moviesService.generateKeyboard(movies);
    return { message: "your search result : ", keyboard };
  }
}
