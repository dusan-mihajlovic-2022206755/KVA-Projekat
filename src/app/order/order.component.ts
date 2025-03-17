
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
import {Projection} from '../../models/projection.model';
import Swal from 'sweetalert2';

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
            status: 'slobodno',
            price: 0
          }
          this.projection!.movie = rsp.data;
        })
    })
  }

  public doOrder() {
    Swal.fire({
      title: `Rezeviši projekciju ${this.projection!.movie.title} filma?`,
      text: "Rezervacije mogu biti otkazane u svakom trenutku!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: 'bg-dark'
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Rezerviši!"
    }).then((result) => {
      if (result.isConfirmed) {
        const result = UserService.createOrder({
          id: this.projection!.id,
          movieId: this.projection!.movie.movieId,
          count: this.selectedTicketCount,
          pricePerItem: this.selectedPrice,
          status: 'rezervisano',
          rating: null
        })
        result ? this.router.navigate(['/user']) :
          Swal.fire({
            title: "Neuspešna rezervacija!",
            text: "Nešto nije u redu sa Vašom rezervacijom!",
            icon: "error"
          });
      }
    })
  }
}
