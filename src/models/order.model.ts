export interface OrderModel {
    id: number
    movieId: number
    count: number
    pricePerItem: number
    status: 'slobodno' | 'rezervisano' | 'gledano' | 'otkazano',
    rating: null | boolean
}
