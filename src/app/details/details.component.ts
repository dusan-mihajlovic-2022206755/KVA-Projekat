
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movieService';
import { NgIf } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { SafePipe } from "../safe.pipe";
import {MovieModel} from '../../models/movie.model';
import {Projection} from '../../models/projection.model';
import {AxiosError} from 'axios';

@Component({
  selector: 'app-details',
  imports: [NgIf, LoadingComponent, MatCardModule, MatListModule, MatButtonModule, SafePipe, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  private movie: MovieModel | null = null
  public projection: Projection | null = null
  public error: string | null = null;

  protected readonly MovieService = MovieService;

  public constructor(private route: ActivatedRoute, public utils: UtilsService) {
    route.params.subscribe(params => {
      console.log("Route Params:", params); // Debugging
      MovieService.getMovieById(params['id'])
        .then(rsp => {
          this.movie = rsp.data;
        })
        .then(() => {
          this.projection = {
            id: this.movie?.movieId || -1,
            status: 'slobodno',
            movie: this.movie ?? MovieService.getDefaultMovie(),
            price: 0,
            reviews: []
          };
        })
        .catch((e: AxiosError) => {
          this.error = `${e.code}: ${e.message}`;
        });
    });
  }

}
