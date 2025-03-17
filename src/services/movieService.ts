import axios from 'axios';
import {MovieModel} from '../models/movie.model';

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api/',
    headers: {
        'Accept': 'application/json',
        'X-Client-Name': 'KVA/DusanMihajlovic2022206755'
    },
    validateStatus: (status: number) => {
        return status === 200
        // Samo ako je 200 vrati response
        // U ostalim slucajevima baci izuzetak
    }
})

export class MovieService {
    static async getMovies(page: number = 0, size: number = 10) {
        return client.request({
            url: '/movie',
            method: 'GET',
            params: {
                'page': page,
                'size': size,
                'sort': 'startDate,asc',
                'type': 'genre'
            }
        })
    }

    static async getMovieById(id: number) {
        return client.get(`/movie/${id}`)
    }

    static async getDestinations() {
        return client.get('/movie/movieActors')
    }
  static async getAllGenres() {
    return client.get('/genre')
  }
  static async getAllActors() {
    return client.get('/actor')
  }
  static async getAllDirectors() {
    return client.get('/director')
  }
    static async getAllRuntime () {
    return client.get('movie/runtime')
  }
    public static getMovieActors(movieModel: MovieModel): string {
      return movieModel.movieActors?.map(x => x.actor.name).join(', ') || '';
    }

    public static getMovieGenres(movieModel: MovieModel): string {
      return movieModel.movieGenres?.map(x => x.genre.name).join(', ') || '';
    }

    public  static  getDefaultMovie() : MovieModel {
      return {
        movieId: -1,
        internalId: "unknown",
        corporateId: "unknown",
        directorId: 0,
        title: "Unknown",
        originalTitle: "Unknown",
        description: "No description available.",
        shortDescription: "Short description unavailable.",
        poster: "https://via.placeholder.com/150",
        startDate: "1900-01-01",
        shortUrl: "https://example.com",
        runTime: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        director: {directorId: -1,
                   name: '',
                   createdAt: ''
                   },
        movieActors: [],
        movieGenres: []
      };

    }

}
