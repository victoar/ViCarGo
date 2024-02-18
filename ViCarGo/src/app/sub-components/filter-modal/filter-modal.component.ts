import {Component, Input, OnInit} from '@angular/core';
import {CAR_BRANDS, CarBrand} from "../../services/car-brands";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModalController, Platform} from "@ionic/angular";
import {FilterCarModel} from "../../models/filterCarModel";
import {format, parseISO} from "date-fns";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent  implements OnInit {
  isIOS: boolean;

  @Input()
  filterModel: FilterCarModel;

  startDateValue = null;
  endDateValue = null;
  formattedStartDateValue = '';
  formattedEndDateValue = '';
  now: string;

  filterDistance: number = 5;
  filterPrice = {lower: 10, upper: 200};
  carBrands = CAR_BRANDS;
  brandSelection: string = 'Any';
  yearSelection: string = 'Any';
  transmissionSelection: string = 'Any';
  transmissionTypes: string[] = ["Any", "Automatic", "Electric", "Hybrid", "Manual"];
  years: string[];
  // filterCarsForm: FormGroup;

  constructor(private platform: Platform,
              private modalController: ModalController,
              private toastService: ToastService) { }

  ngOnInit() {
    this.isIOS = this.platform.is('ios');
    this.now = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
    this.carBrands = [new CarBrand("Any", []), ...this.carBrands];
    this.years = ['Any', ...Array.from({ length: 44 }, (_, index) => (new Date().getFullYear() - index).toString())];
    // this.initializeForm();
    this.initializeFilter();
  }

  // initializeForm() {
  //   this.filterCarsForm = new FormGroup({
  //     brand: new FormControl('', Validators.required),
  //     year: new FormControl('', Validators.required),
  //     transmission: new FormControl('', Validators.required),
  //     // price: new FormControl('', Validators.required),
  //   });
  //   this.filterCarsForm.get('model').disable();
  // }

  initializeFilter() {
    if(this.filterModel) {
      if(this.filterModel.selectedBrand) {
        this.brandSelection = this.filterModel.selectedBrand;
      }
      if(this.filterModel.selectedTransmission) {
        this.transmissionSelection = this.filterModel.selectedTransmission;
      }
      if(this.filterModel.minPrice) {
        this.filterPrice.lower = this.filterModel.minPrice;
      }
      if(this.filterModel.maxPrice) {
        this.filterPrice.upper = this.filterModel.maxPrice;
      }
      if(this.filterModel.newerThan) {
        this.yearSelection = this.filterModel.newerThan;
      }
      if(this.filterModel.startDate) {
        this.startDateValue = this.filterModel.startDate;
        this.formattedStartDateValue = format(parseISO(this.startDateValue), 'HH:mm, MMM d, yyyy');
      }
      if(this.filterModel.endDate) {
        this.endDateValue = this.filterModel.endDate;
        this.formattedEndDateValue = format(parseISO(this.endDateValue), 'HH:mm, MMM d, yyyy');
      }
    }
  }

  getBrandFromString(brand: string) {
    if(brand) {
      return CAR_BRANDS.find(item => item.name == brand);
    }
    return null;
  }

  // onCarBrandChange() {
  //   // console.log(this.carForm.get('brand').value);
  //   this.models = this.filterCarsForm.get('brand').value ?
  //     this.getBrandFromString(this.filterCarsForm.get('brand').value).models : [];
  //   this.filterCarsForm.get('model').enable();
  //   this.filterCarsForm.get('model').reset();
  // }

  showNewResults() {
    // console.log(this.filterCarsForm.value);
    if(this.startDateValue != null && this.endDateValue == null) {
      this.toastService.showToast('Please set an end date', 'danger')
      return;
    }
    this.filterModel = {
      minPrice: this.filterPrice.lower,
      maxPrice: this.filterPrice.upper,
      selectedBrand: this.brandSelection,
      selectedTransmission: this.transmissionSelection,
      selectedRadius: this.filterDistance,
      newerThan: this.yearSelection,
      startDate: this.startDateValue,
      endDate: this.endDateValue
    }
    this.modalController.dismiss({
      data: this.filterModel
    }, 'response');
  }

  resetModal() {
    this.filterDistance = 5;
    this.filterPrice = {lower: 10, upper: 200};
    this.brandSelection = 'Any';
    this.yearSelection = 'Any';
    this.transmissionSelection = 'Any';
    this.startDateValue = null;
    this.formattedStartDateValue = '';
    this.endDateValue = null;
    this.formattedEndDateValue = '';
  }

  dismissModal() {
    this.modalController.dismiss({}, 'cancel');
  }

  startDateChanged(value) {
    try {
      this.startDateValue = value;
      this.formattedStartDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy');
      if(value > this.endDateValue) {
        this.endDateValue = value;
        this.formattedEndDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy')
      }
    } catch (e) {
      this.toastService.showToast('Your time interval is too soon', 'danger')
    }
  }

  endDateChanged(value) {
    try {
      this.endDateValue = value;
      this.formattedEndDateValue = format(parseISO(value), 'HH:mm, MMM d, yyyy');
    } catch (e) {
      this.toastService.showToast('Your time interval is too soon', 'danger')
    }
  }
}
