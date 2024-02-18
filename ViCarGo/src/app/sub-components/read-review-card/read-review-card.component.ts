import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-read-review-card',
  templateUrl: './read-review-card.component.html',
  styleUrls: ['./read-review-card.component.scss'],
})
export class ReadReviewCardComponent  implements OnInit {
  @Input()
  userFirstName: string;

  @Input()
  rating: number;

  @Input()
  text: string;

  @Input()
  createdAt: any;

  isStarClicked: boolean[] = [false, false, false, false, false]

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.rating; i++) {
      this.isStarClicked[i] = true;
    }
  }

}
