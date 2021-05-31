import { Injectable } from "../../packages/common/mod.ts";

interface Movie {
  name: string;
}

const movies: Movie[] = [
  {
    name: "inception",
  },
  {
    name: "mad max",
  },
  {
    name: "godfather",
  },
];

@Injectable()
export class MoviesService {
  search(query: string) {
    return movies.filter(({ name }) => name.includes(query));
  }
  generateKeyboard(movies: Movie[]) {
    return movies.map(({ name }) => ({ text: name, data: name }));
  }
}
