
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movieService';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { SafePipe } from "../safe.pipe";
import {MovieModel} from '../../models/movie.model';
import {Projection} from '../../models/projection.model';
import {AxiosError} from 'axios';
import {MatIcon} from '@angular/material/icon';
import {Review} from '../../models/review.model';

@Component({
  selector: 'app-details',
  imports: [NgIf, CommonModule, MatIcon, LoadingComponent, MatCardModule, MatListModule, MatButtonModule, SafePipe, RouterLink, DatePipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  private movie: MovieModel | null = null
  public projection: Projection | null = null
  public error: string | null = null;

  protected readonly MovieService = MovieService;
  protected readonly UtilsService = UtilsService;

  public constructor(private route: ActivatedRoute, public utils: UtilsService) {
    route.params.subscribe(params => {
      MovieService.getMovieById(params['id'])
        .then(rsp => {
          this.movie = rsp.data;
        })
        .then(() => {
          //fiktivni podaci...
          let randomizedRating1 = Math.round((Math.random() * (5 - 1) + 1) * 10) / 10
          let randomizedRating2 = Math.round((Math.random() * (5 - 1) + 1) * 10) / 10
          let fakeReviews = [
            {reviewText: "Lorem ipsum mnogo dobar film!",
              rating: randomizedRating1,
              username: "objektivni-recezent"},
            {reviewText: "Ipsum lorem film ne valja ništa!",
              rating: randomizedRating2,
              username: "nezadovoljni"}
          ]
          this.projection = {
            id: this.movie?.movieId || -1,
            status: 'slobodno',
            movie: this.movie ?? MovieService.getDefaultMovie(),
            price: 0,
            averageRating: fakeReviews.reduce((total, review) => total + review.rating, 0) / fakeReviews.length,
            reviews: fakeReviews
          };
        })
        .catch((e: AxiosError) => {
          this.error = `${e.code}: ${e.message}`;
        });
    });
  }
}
