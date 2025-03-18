import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movieService';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import {Genre} from '../../models/movie.model';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, NgFor, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public genreList: Genre[] = []
  public email = ''
  public password = ''
  public repeatPassword = ''
  public firstName = ''
  public lastName = ''
  public phone = ''
  public address = ''
  public favouriteGenre = ''

  public constructor(private router: Router, private utils: UtilsService) {
    MovieService.getAllGenres()
      .then(rsp => this.genreList = rsp.data)
  }

  public doSignup() {
    if (!this.email.trim() || !this.password.trim()) {
      this.utils.openRedSnackbar('Email i lozinka su obavezna polja!');
      return;
    }

    if (!this.firstName.trim()) {
      this.utils.openRedSnackbar('Ime je obavezno!');
      return;
    }

    if (!this.lastName.trim()) {
      this.utils.openRedSnackbar('Prezime je obavezno!');
      return;
    }

    if (!this.phone.trim()) {
      this.utils.openRedSnackbar('Telefon je obavezan!');
      return;
    }

    if (!this.address.trim()) {
      this.utils.openRedSnackbar('Adresa je obavezna!');
      return;
    }

    if (!this.favouriteGenre.trim()) {
      this.utils.openRedSnackbar('Omiljeni žanr je obavezan!');
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.utils.openRedSnackbar('Lozinke se ne poklapaju!');
      return;
    }

    const result = UserService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      favouriteGenre: this.favouriteGenre,
      orders: []
    });

    if (result) {
      this.utils.openGreenSnackbar('Registracija uspešna!');
      this.router.navigate(['/login']);
    } else {
      this.utils.openRedSnackbar('Nalog sa ovom email adresom već postoji!');
    }
  }

}
