import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-array-item',
  templateUrl: './empty-array-item.component.html',
  styleUrls: ['./empty-array-item.component.scss'],
})
export class EmptyArrayItemComponent  implements OnInit {

  @Input()
  displayText: string;

  @Input()
  imagePath: string;

  @Input()
  isBigImage: boolean;

  constructor() { }

  ngOnInit() {}

}
