import { MovieModel } from "./movie.model"

export interface OrderModel {
    id: number
    movieId: number
    count: number
    pricePerItem: number
    status: 'rezervisano' | 'gledano' | 'otkazano',
    rating: null | boolean
}
