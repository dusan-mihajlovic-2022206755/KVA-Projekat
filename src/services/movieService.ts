import axios from 'axios';

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
}
