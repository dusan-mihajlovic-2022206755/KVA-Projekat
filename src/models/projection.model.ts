import { MovieModel } from "./movie.model"
import {Review} from './review.model';

export interface Projection {
  id: number
  movie: MovieModel
  reviews: Review[]
  status: string
  price: number
}
