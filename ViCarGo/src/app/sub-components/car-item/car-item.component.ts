import {Component, Input, OnInit} from '@angular/core';
import {CarModel} from "../../models/carModel";

@Component({
  selector: 'app-car-item',
  templateUrl: './car-item.component.html',
  styleUrls: ['./car-item.component.scss'],
})
export class CarItemComponent  implements OnInit {

  @Input()
  carItem: CarModel;

  @Input()
  isMock: boolean;

  constructor() { }

  ngOnInit() {}

}
