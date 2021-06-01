import { Injectable } from "../../packages/common/mod.ts";

interface Movie {
  name: string;
  date: number;
  score: number;
}

const movies: Movie[] = [
  {
    name: "inception",
    date: 2010,
    score: 8.6,
  },
  {
    name: "mad max",
    date: 2015,
    score: 8.1,
  },
  {
    name: "godfather",
    date: 1972,
    score: 9.2,
  },
];

@Injectable()
export class MoviesService {
  getAll() {
    return movies;
  }

  getByName(name: string) {
    return movies.find(({ name: storedName }) => storedName === name);
  }

  search(query: string) {
    return movies.filter(({ name }) => name.includes(query));
  }

  generateKeyboard(movies: Movie[]) {
    return movies.map(({ name }) => ({ text: name, data: name }));
  }
}
