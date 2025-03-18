import {Component, ViewEncapsulation} from '@angular/core';
import { UserService } from '../../services/user.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { OrderModel } from '../../models/order.model';
import {UtilsService} from '../../services/utils.service';
import {MovieService} from '../../services/movieService';
import {Genre, MovieModel} from '../../models/movie.model';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UserComponent {
  public displayedColumns: string[] = ['id', 'title', 'count', 'pricePerItem', 'total', 'status', 'rating', 'actions'];
  public user: UserModel | null = null
  public userCopy: UserModel | null = null

  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  public moviesList: MovieModel[] | null = null
  public genreList: Genre[] = [];
  constructor(private router: Router, private utils: UtilsService) {
    MovieService.getMovies(0, 3)
      .then(rsp => {
        this.moviesList = rsp.data;
      })
    MovieService.getAllGenres()
      .then(rsp => this.genreList = rsp.data)


    if (!UserService.getActiveUser()) {
      // Korisnik aplikacije nije ulogovan
      // Vrati korisnika na homepage
      router.navigate(['/home'])
      return
    }

    this.user = UserService.getActiveUser()
    this.userCopy = UserService.getActiveUser()

    // if (this.user && this.user.orders && this.moviesList) {
    //   this.user.orders.forEach(order => {
    //     const movie = this.moviesList?.find(movie => movie.movieId === order.movieId);
    //     order.title = movie ? movie.title : 'N/A';
    //   });
    // }

  }
  public doChangePassword() {
    if (this.oldPasswordValue == '' || this.newPasswordValue == null) {
      this.utils.openRedSnackbar("Lozinka ne sme biti prazna!");
      return
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      this.utils.openRedSnackbar("Lozinke se ne poklapaju!");
      return
    }

    if (this.oldPasswordValue !== this.user?.password) {
      this.utils.openRedSnackbar("Lozinke se ne poklapaju!");
      return
    }

    alert(
      UserService.changePassword(this.newPasswordValue) ?
        'Lozinka uspešno izmenjena!' : 'Došlo je do greške prilikom izmene lozinke!'
    )

    this.oldPasswordValue = ''
    this.newPasswordValue = ''
    this.repeatPasswordValue = ''
  }
  public doUpdateUser() {
    if (!this.userCopy) {
      alert('User not defined');
      return;
    }

    if (!this.userCopy.firstName || this.userCopy.firstName.trim() === '') {
      this.utils.openRedSnackbar('Ime ne sme biti prazno!');
      return;
    }
    if (!this.userCopy.lastName || this.userCopy.lastName.trim() === '') {
      this.utils.openRedSnackbar('Prezime ne sme biti prazno!');
      return;
    }
    if (!this.userCopy.email || this.userCopy.email.trim() === '') {
      this.utils.openRedSnackbar('Email ne sme biti prazan!');
      return;
    }
    if (!this.userCopy.address || this.userCopy.address.trim() === '') {
      this.utils.openRedSnackbar('Adresa ne sme biti prazna!');
      return;
    }
    if (!this.userCopy.phone || this.userCopy.phone.trim() === '') {
      this.utils.openRedSnackbar('Kontakt telefon ne sme biti prazan!');
      return;
    }
    UserService.updateUser(this.userCopy);
    this.user = UserService.getActiveUser();
    this.utils.openGreenSnackbar('Podaci o korisniku ažurirani!');
  }

  public doPay(order: OrderModel) {
    if (UserService.changeOrderStatus('gledano', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doCancel(order: OrderModel) {
    if (UserService.changeOrderStatus('otkazano', order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  public doRating(order: OrderModel, r: number) {
    if (UserService.changeRating(r, order.id)) {
      this.user = UserService.getActiveUser()
    }
  }

  protected readonly MovieService = MovieService;
}
