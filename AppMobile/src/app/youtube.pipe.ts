import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
@Pipe({
  name: 'youtube'
})
export class YoutubePipe implements PipeTransform {

  constructor(private dom: DomSanitizer){

  }
  transform(value: string): unknown {
    console.log(this.dom.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+value));
    return this.dom.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+value+"?autoplay=1");
  }

}
