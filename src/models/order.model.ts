import { MovieModel } from "./movie.model"

export interface OrderModel {
    id: number
    movieId: number
    reservationNumber: number
    movie: MovieModel
    count: number
    pricePerItem: number
    status: 'ordered' | 'paid' | 'canceled',
    rating: null | boolean
}
