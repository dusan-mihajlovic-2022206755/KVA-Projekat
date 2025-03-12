import {Component} from '@angular/core';
import {MovieService} from '../../services/movieService';
import {NgFor, NgIf} from '@angular/common';
import {AxiosError} from 'axios';
import {MovieModel} from '../../models/movie.model';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {UtilsService} from '../../services/utils.service';
import {LoadingComponent} from "../loading/loading.component";
import {RouterLink} from '@angular/router';
import {Projection} from '../../models/projection.model';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatButtonModule, MatCardModule, LoadingComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private movies: MovieModel[] | null = null;
  public projections: Projection[] | null = null;
  public error: string | null = null;
  constructor(
    public utils: UtilsService
  ) {
    MovieService.getMovies(0, 3)
      .then(rsp => {
        this.movies = rsp.data;
      })
      .then(x =>
        this.projections = this.movies?.map(movie => ({
          id: movie.movieId, //staviti guid?
          movie: movie,
          reviews: [],
          averageRating: 0 || 0,
          price: 0
        })) || []
      )
      .catch((e: AxiosError) => {
        this.error = `${e.code}: ${e.message}`;
      });
  }


  protected readonly MovieService = MovieService;
}
