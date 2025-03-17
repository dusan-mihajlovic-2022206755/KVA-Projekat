import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { Actor, Director, Genre, MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movieService';
import { Projection } from '../../models/projection.model';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-search',
  standalone: true, // ✅ Required for imports
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    MatButtonModule,
    LoadingComponent,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'], // ✅ Fixed typo (`styleUrls`)
})
export class SearchComponent {
  displayedColumns: string[] = ['poster', 'name', 'description', 'genre', 'actors', 'startsAt', 'createdAt', 'duration', 'price', 'rating', 'actions'];
  allData: Projection[] = []; // ✅ Default to empty array
  genreList: Genre[] = [];
  runtimeList: number[] = [];
  selectedGenre: string | null = null;
  selectedRuntime: number | null = null;

  dataSource: Projection[] = [];
  userInput: string = '';
  startAtDateOptions: string[] = [];
  createdAtDateOptions: string[] = [];
  selectedStartAtDate: string | null = null;
  selectedCreatedAtDate: string | null = null;
  movies: MovieModel[] = [];

  public error: string | null = null;

  public constructor(public utils: UtilsService) {
    MovieService.getAllGenres()
      .then((rsp) => (this.genreList = rsp.data))
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));

    MovieService.getAllRuntime()
      .then((rsp) => (this.runtimeList = rsp.data))
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));

    MovieService.getMovies(0, 3)
      .then((rsp) => {
        this.movies = rsp.data;
        this.allData = this.movies.map((movie) => ({
          id: movie.movieId,
          movie,
          reviews: [],
          averageRating: 0,
          price: 150,
        }));
        this.dataSource = [...this.allData];

        this.generateSearchCriteria(this.dataSource)

      })
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));


  }

  public getActorsAndDirector(movie: MovieModel): string {
    const actors = MovieService.getMovieActors(movie) || [];
    return [actors, movie.director.name].join(', ');
  }

  public generateSearchCriteria(source: Projection[]) {
    this.startAtDateOptions = source.map(obj => {console.log(obj);return obj.movie.startDate; })
        .map((obj: string) => obj.split('T')[0])
        .filter((date: string, i: number, ar: any[]) => ar.indexOf(date) === i)

    this.createdAtDateOptions = source.map(obj => obj.movie.createdAt)
      .map((obj: string) => obj.split('T')[0])
      .filter((date: string, i: number, ar: any[]) => ar.indexOf(date) === i)
  }

  public doReset() {
    this.userInput = '';
    this.selectedGenre = null;
    this.selectedStartAtDate = null;
    this.selectedRuntime = null;
    this.dataSource = [...this.allData];
    this.generateSearchCriteria(this.dataSource);
  }

  public doFilterChain() {
    if (!this.allData) return;

    this.dataSource = this.allData
      .filter((obj) => {
        if (!this.userInput) return true;
        return (
          obj.movie.originalTitle.toLowerCase().includes(this.userInput.toLowerCase()) ||
          obj.movie.movieId.toString().includes(this.userInput) ||
          obj.movie.shortDescription.includes(this.userInput)
        );
      })
      .filter((obj) => {
        if (!this.selectedGenre) return true;
        return MovieService.getMovieGenres(obj.movie).includes(this.selectedGenre);
      })
      .filter((obj) => {
      if (!this.selectedRuntime) return true;
      return obj.movie.runTime === this.selectedRuntime;
    })
      .filter((obj) => {
        if (!this.selectedStartAtDate) return true;
        const start = new Date(`${this.selectedStartAtDate}T00:00:01`);
        const end = new Date(`${this.selectedStartAtDate}T23:59:59`);
        const target = new Date(obj.movie.startDate);
        return start <= target && target <= end;
      });

    this.generateSearchCriteria(this.dataSource);
  }

  protected readonly MovieService = MovieService;
}
