import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {UtilsService} from '../../services/utils.service';
import {LoadingComponent} from '../loading/loading.component';
import {RouterLink} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {Genre, MovieModel} from '../../models/movie.model';
import {MovieService} from '../../services/movieService';
import {Projection} from '../../models/projection.model';
import {AxiosError} from 'axios';

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
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'], // ✅ Fixed typo (`styleUrls`)
})
export class SearchComponent {
  displayedColumns: string[] = ['poster', 'name', 'description', 'genre', 'actors', 'startsAt', 'createdAt', 'duration', 'price', 'rating', 'actions'];
  allData: Projection[] = [];

  genreList: Genre[] = [];
  runtimeList: number[] = [];
  priceList: number[] = [];
  ratingList: string[] = [];

  dataSource: Projection[] = [];
  userInput: string = '';
  startAtDateOptions: string[] = [];
  createdAtDateOptions: string[] = [];

  selectedGenre: string | null = null;
  selectedRuntime: number | null = null;
  selectedStartAtDate: string | null = null;
  selectedCreatedAtDate: string | null = null;
  selectedStatus: string | null = null;
  selectedPrice: number | null = null;
  selectedRating: string | null = null;
  public error: string | null = null;

  public constructor(public utils: UtilsService) {

    MovieService.getMovies(0, 3)
      .then((rsp) => {
        let movies: MovieModel[] = rsp.data;
        this.allData = movies.map((movie) => ({
          id: movie.movieId,
          movie: movie,
          averageRating: Math.round((Math.random() * (5 - 1) + 1) * 10) / 10,
          status: 'slobodno',
          price: 150,
          reviews: []
        }));
        this.dataSource = [...this.allData];

        this.generateSearchCriteria(this.allData)

      })
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));
  }

  public getActorsAndDirector(movie: MovieModel): string {
    const actors = MovieService.getMovieActors(movie) || [];
    return [actors, movie.director.name].join(', ');
  }

  public generateSearchCriteria(source: Projection[]) {
    this.startAtDateOptions = source.map(obj => {
      return obj.movie.startDate;
    })
      .map((obj: string) => obj.split('T')[0])
      .filter((date: string, i: number, ar: any[]) => ar.indexOf(date) === i)

    this.createdAtDateOptions = source.map(obj => obj.movie.createdAt)
      .map((obj: string) => obj.split('T')[0])
      .filter((date: string, i: number, ar: any[]) => ar.indexOf(date) === i)

    MovieService.getAllGenres()
      .then((rsp) => (this.genreList = rsp.data))
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));

    MovieService.getAllRuntime()
      .then((rsp) => (this.runtimeList = rsp.data))
      .catch((e: AxiosError) => (this.error = `${e.code}: ${e.message}`));

    this.priceList = [...new Set(this.allData.map(x => x.price))];
    this.ratingList = ["2+", "3+", "4+"];
  }

  public doReset() {
    this.userInput = '';
    this.selectedGenre = null;
    this.selectedStartAtDate = null;
    this.selectedCreatedAtDate = null;
    this.selectedRuntime = null;
    this.selectedStatus = null;
    this.selectedPrice = null;
    this.selectedRating = null;
    this.dataSource = [...this.allData];
    this.generateSearchCriteria(this.allData);
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
        if (!this.selectedStatus) return true;
        return obj.status === this.selectedStatus;
      })
      .filter((obj) => {
        if (!this.selectedPrice) return true;
        return obj.price === this.selectedPrice;
      })
      .filter((obj) => {
        if (!this.selectedRating) return true;
        let selectedRatingInt: number = parseInt(this.selectedRating[0], 10)   ;
        return obj.averageRating >= selectedRatingInt;
      })
      .filter((obj) => {
        if (!this.selectedStartAtDate) return true;
        const start = new Date(`${this.selectedStartAtDate}T00:00:01`);
        const end = new Date(`${this.selectedStartAtDate}T23:59:59`);
        const target = new Date(obj.movie.createdAt);
        return start <= target && target <= end;
      })
      .filter((obj) => {
        if (!this.selectedCreatedAtDate) return true;
        const start = new Date(`${this.selectedCreatedAtDate}T00:00:01`);
        const end = new Date(`${this.selectedCreatedAtDate}T23:59:59`);
        const target = new Date(obj.movie.startDate);
        return start <= target && target <= end;
      });
    this.generateSearchCriteria(this.allData);
  }

  protected readonly MovieService = MovieService;
  protected readonly UtilsService = UtilsService;
}
