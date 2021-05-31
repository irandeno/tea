import { Controller, Hears, Param } from "../../packages/common/mod.ts";
import { MoviesService } from "./movies.service.ts";

@Controller()
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Hears("{movie:string}")
  search(@Param("movie") movie: string) {
    const movies = this.moviesService.search(movie);
    const keyboard = this.moviesService.generateKeyboard(movies);
    return { message: "your search result : ", keyboard };
  }
}
