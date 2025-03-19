import {Component} from '@angular/core';
import {MovieService} from '../../services/movieService';
import {DatePipe, NgFor, NgIf} from '@angular/common';
import {AxiosError} from 'axios';
import {MovieModel} from '../../models/movie.model';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {UtilsService} from '../../services/utils.service';
import {LoadingComponent} from "../loading/loading.component";
import {RouterLink} from '@angular/router';
import {Projection} from '../../models/projection.model';
import {MatListModule} from '@angular/material/list';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, MatListModule, MatButtonModule, MatCardModule, LoadingComponent, RouterLink, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private movies: MovieModel[] | null = null;
  public projections: Projection[] | null = null;
  public favouriteGenreProjections: Projection[] | null = null;
  public error: string | null = null;
  constructor(
    public utils: UtilsService
  ) {

///////.filter(x => x.movieGenres.some(y => y.genre.name !== user.favouriteGenre))
    MovieService.getMovies(0, 3)
      .then(rsp => {
        this.movies = rsp.data;
      })
      .then(x =>
        this.projections = this.movies?.map(movie => ({
          id: movie.movieId, //staviti guid?
          movie: movie,
          averageRating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
          status: 'slobodno',
          price: 0,
          reviews:[]
        })) || []
      ).then(()=>{
      if (user !== null){
        this.favouriteGenreProjections = this.projections!.filter(x => x.movie.movieGenres.find(y => y.genre.name === user.favouriteGenre)) || null

        const favouriteProjectionIds = new Set(this.favouriteGenreProjections?.map(p => p.id));
        this.projections = this.projections?.filter(x =>
          !favouriteProjectionIds.has(x.id)
        ) || null;
      }
    })
      .catch((e: AxiosError) => {
        this.error = `${e.code}: ${e.message}`;
      });
    let user:  UserModel | null = UserService.getActiveUser()


  }


  protected readonly MovieService = MovieService;
}
