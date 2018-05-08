

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CodeService {

    constructor(private http: HttpClient) { }

    getCodes() {
    console.log(this.http.get<any>('./assets/icd9_codes.json'));
    return this.http.get<any>('./assets/icd9_codes.json')
      .toPromise()
      .then(res => <any[]>res.icd9_codes)
      .then(data => { return data; });
    }
}