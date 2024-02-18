import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CloudVisionApiService {
  private apiUrl: string = 'http://127.0.0.1:5000/process_image';

  constructor(private http: HttpClient) {
  }

  validateDocument(imageBase64: string, firstName: string, lastName: string, birthday: string) {

    const imageBlob = this.dataURItoBlob(imageBase64);
    const imageFile = new File([imageBlob], 'image.jpg');

    const formData: FormData = new FormData();
    formData.append('image', imageFile);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthday', birthday);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post(this.apiUrl, formData, { headers });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const binaryString = window.atob(dataURI);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'image/jpeg' });
  }
}
