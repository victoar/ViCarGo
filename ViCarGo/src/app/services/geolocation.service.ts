import { Injectable } from '@angular/core';
import {Geolocation} from "@capacitor/geolocation";
import {LocationAccuracy} from "@awesome-cordova-plugins/location-accuracy/ngx";
import * as ngeohash from "ngeohash";


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private locationAccuracy: LocationAccuracy
  ) { }

  async enableLocation() {
    try {
      const canRequest: boolean = await this.locationAccuracy.canRequest();
      if(canRequest) {
        await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        console.log("Request successful");
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      throw(e);
    }
  }

  getCurrentLocation() {
    return Geolocation.getCurrentPosition().then(coord => {
      return coord;
      })
      .catch(e => {
        throw(e);
      })
  }

  requestLocationPermission() {
    return Geolocation.requestPermissions().then(status => {
      return status;
    })
      .catch(e => {
        throw(e);
      })
  }

  getGeoHashRange(longitude: number, latitude: number, radius: number) {
    const latDegreePerKm = 1 / 110.574; // Degrees latitude per kilometer
    const lonDegreePerKm = 1 / (111.320 * Math.cos(latitude * Math.PI / 180)); // Degrees longitude per kilometer

    const lowerLat = latitude - (latDegreePerKm * radius);
    const lowerLon = longitude - (lonDegreePerKm * radius);

    const upperLat = latitude + (latDegreePerKm * radius);
    const upperLon = longitude + (lonDegreePerKm * radius);

    const lower = ngeohash.encode(lowerLat, lowerLon);
    const upper = ngeohash.encode(upperLat, upperLon);

    return {
      lower,
      upper
    };
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
