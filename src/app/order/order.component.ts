
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movieService';
import { UtilsService } from '../../services/utils.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import {MovieModel} from '../../models/movie.model';
import {Projection} from '../../models/projection.model';

@Component({
  selector: 'app-order',
  imports: [MatCardModule, NgIf, NgFor, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  public projection: Projection | null = null;
  //public movies: MovieModel[] = []
  public selectedTicketCount: number = 1
  public selectedPrice: number = 150

  public constructor(private route: ActivatedRoute, public utils: UtilsService, private router: Router) {
    route.params.subscribe(params => {
      MovieService.getMovieById(params['id'])
        .then(rsp => {
          let movie = rsp.data;
          this.projection = {
            id: movie.movieId, //staviti guid?
            movie: movie,
            reviews: [],
            averageRating: 0 || 0,
            price: 0
          }
          this.projection!.movie = rsp.data;
        })
    })
  }

  public doOrder() {
        const result = UserService.createOrder({
          id: this.projection!.id,
          movieId: this.projection!.movie.movieId,
          count: this.selectedTicketCount,
          pricePerItem: this.selectedPrice,
          status: 'rezervisano',
          rating: null
        })

        result ? this.router.navigate(['/user']) : alert('An error occured while creating an order')

    //   MovieService.getMovieById(this.selectedMovie).then(rsp => {
  //     const result = UserService.createOrder({
  //       id: this.selectedMovie,
  //       movieId: this.selectedMovie,
  //       reservationNumber: this.selectedMovie,
  //       movie: this.movies.find(x => x.movieId === this.selectedMovie)!,
  //       count: this.selectedTicketCount,
  //       pricePerItem: this.selectedPrice,
  //       status: 'ordered',
  //       rating: null
  //     })
  //
  //     result ? this.router.navigate(['/user']) : alert('An error occured while creating an order')
  //   })
  //
  //
  }
}
