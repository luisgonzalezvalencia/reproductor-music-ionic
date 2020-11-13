import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { URL_SERVICES } from '../config/config';

@Injectable({
  providedIn: 'root'
})

export class GetService {

  constructor(public http: HttpClient,
    private toastServ: ToastService) {
  }

  httpGet(url) {
    let promesa = new Promise((resolve) => {
      this.http.get(url)
        .subscribe((data: any) => {
          resolve(data)
        },
          (error) => {
            console.log(error);
            this.toastServ.toastMensajeDelServidor('Hubo un timeout con el servidor, revise su conexión a internet e inténtelo nuevamente');
          })
    })
    return promesa
  }

  httpPost(data, url) {
    let promesa = new Promise((resolve,) => {
      this.http.post(url, JSON.stringify(data), { headers: { 'Content-Type': "application/json" } })
        .subscribe((data: any) => {
          resolve(data)
        },
          (error) => {
            this.toastServ.toastMensajeDelServidor('Hubo un timeout con el servidor, revise su conexión a internet e inténtelo nuevamente');
          })
    })
    return promesa
  }


  comando(comando, busqueda) {
    let promesa = new Promise((resolve) => {
      let url = URL_SERVICES + '/musica2?comando=' + comando + '&search=' + busqueda;
      this.httpGet(url).then((data) => {
        resolve(data);
      })
    })
    return promesa
  }

  comandoPost(comando, busqueda) {
    let promesa = new Promise((resolve) => {
      let url = URL_SERVICES + '/search';
      let data = {
        "song": busqueda
      }

      this.httpPost(data, url).then((data) => {
        resolve(data)
      })
    })
    return promesa
  }



}
