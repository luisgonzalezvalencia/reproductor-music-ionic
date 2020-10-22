import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    constructor(public http: HttpClient,
                private toastCtrl: ToastController) {
    }

   
    toastMensajeDelServidor(mensaje , status? , tiempo?){
      this.presentToast(mensaje, tiempo);
    }

    async presentToast(mensaje, tiempo?) {
      if(tiempo == undefined){
        tiempo = 3000;
      }
      const toast = await this.toastCtrl.create({
        message: mensaje,
        position: 'top',
        duration: tiempo,
        buttons: ["Cerrar"],
        cssClass: "success"
      });
      toast.present();
    }

    toastLargo(mensaje){
      this.presentToastLargo(mensaje);
    }

    async presentToastLargo(mensaje) {
      const toast = await this.toastCtrl.create({
        message: mensaje,
        position: 'top',
        duration: 15000,
        buttons: ["Cerrar"],
        cssClass: "success"
      });
      toast.present();
    }
}
