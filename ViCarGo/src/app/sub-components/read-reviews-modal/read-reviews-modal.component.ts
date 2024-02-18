import {Component, Input, OnInit} from '@angular/core';
import {ReviewModel} from "../../models/reviewModel";
import {ModalController} from "@ionic/angular";
import {CarService} from "../../services/car.service";

@Component({
  selector: 'app-read-reviews-modal',
  templateUrl: './read-reviews-modal.component.html',
  styleUrls: ['./read-reviews-modal.component.scss'],
})
export class ReadReviewsModalComponent  implements OnInit {
  @Input()
  carId: string;

  reviews: ReviewModel[];

  constructor(private modalController: ModalController,
              private carService: CarService) { }

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    this.carService.getReviewsForCar(this.carId)
      .then((querySnapshot) => {
        console.log(this.reviews = querySnapshot.docs.map((doc) => doc.data() as ReviewModel));
      })
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
