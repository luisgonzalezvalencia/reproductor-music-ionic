import { Component, ViewChild } from '@angular/core';
import { IonRange, ToastController } from '@ionic/angular';
import * as yt from 'ionic-youtube-streams';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("range", { static: false }) range: IonRange;

  songs = [
    {
      title: "Believer",
      subtitle: "Imagine Dragons",
      img: "https://youtuberancia.com/wp-content/uploads/2019/11/beliver.jpg",
      path: "https://mus1.djxd.tk/mp3/f5de1900-6884-4bd8-8241-58ccab381e4e.mp3",
      type: "mp3"
    },
    {
      title: "Wanderwall",
      subtitle: "Oasis",
      img: "https://slm-assets.secondlife.com/assets/22131711/view_large/8fbfeb.jpg?1542279718",
      path: "https://www.youtube.com/watch?v=RcDjZWQaONg",
      type: "youtube"
    }
  ]

  currTitle;
  currSubtitle;
  currImage;

  //progress bar
  progress = 0;
  isPlaying = false;
  isTouched = false;


  currSecsText;
  durationText;

  currRangeTime;
  maxRangeValue;

  currSong: HTMLAudioElement;

  upNextImg;
  upNextTitle;
  upNextSubtitle;


  constructor(private streamingMedia: StreamingMedia,
    public toastController: ToastController
  ) { }

  async streamVideo(vid: any) {
    vid = "RcDjZWQaONg";
    const info: any = await yt.info(vid);
    this.streamUrl(info.formats[0].url);
  }

  streamUrl(url: any) {
    const options: StreamingVideoOptions = {
      successCallback: () => {

      },
      errorCallback: (e) => {
        console.log(e);
      },
      orientation: 'portrait',
      shouldAutoClose: true,
      controls: true
    };
    this.streamingMedia.playVideo(url, options);
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  playSong(title, subTitle, img, song) {
    if (this.currSong != null) {
      this.currSong.pause();
    }

    //open full view player
    document.getElementById("fullPlayer").style.bottom = "0px";

    //set current song details
    this.currTitle = title;
    this.currSubtitle = subTitle;
    this.currImage = img;

    //current song audio
    this.currSong = new Audio(song);

    this.currSong.play().then(() => {
      //total song duration
      this.durationText = this.sToTime(this.currSong.duration);
      //set range duration  progress in barr
      this.maxRangeValue = Number(this.currSong.duration.toFixed(2).toString().substring(0, 5));

      //set up next song
      //get current song index+
      var index = this.songs.findIndex(x => x.title == this.currTitle);

      //if current song is the last one then set firt song  info for upnext song
      if ((index + 1) == this.songs.length) {
        this.upNextImg = this.songs[0].img;
        this.upNextTitle = this.songs[0].title;
        this.upNextSubtitle = this.songs[0].subtitle;
      } else {
        this.upNextImg = this.songs[index + 1].img;
        this.upNextTitle = this.songs[index + 1].title;
        this.upNextSubtitle = this.songs[index + 1].subtitle;
      }

      this.isPlaying = true;

    })

    this.currSong.addEventListener("timeupdate", () => {
      //update some infos as song  plays on

      // if ion-range not touched then do update
      if (!this.isTouched) {
        //update ion range
        this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));
        //update current secs time text
        this.currSecsText = this.sToTime(this.currSong.currentTime);
        //update progress bar (in minimize view)
        this.progress = (Math.floor(this.currSong.currentTime) / Math.floor(this.currSong.duration));


        //if song end, play next song
        if (this.currSong.currentTime == this.currSong.duration) {
          this.playNext();
        }

      }
    })
  }

  sToTime(t) {
    return this.padZero(parseInt(String((t / (60)) % 60))) + ":" +
      this.padZero(parseInt(String((t) % 60)));
  }

  padZero(v) {
    return (v < 10) ? "0" + v : v;
  }

  playNext() {
    //get current song index
    var index = this.songs.findIndex(x => x.title == this.currTitle);
    //if current song is last then play firts song
    if ((index + 1) == this.songs.length) {
      this.playSong(this.songs[0].title, this.songs[0].subtitle, this.songs[0].img, this.songs[0].path);
    }//else play next song
    else {
      var nextIndex = index + 1;
      this.playSong(this.songs[nextIndex].title, this.songs[nextIndex].subtitle, this.songs[nextIndex].img, this.songs[nextIndex].path);
    }


  }

  playPrev() {
    //get current song index
    var index = this.songs.findIndex(x => x.title == this.currTitle);
    //if current song is last then play firts song
    if (index == 0) {
      var lastIndex = this.songs.length - 1;
      this.playSong(this.songs[lastIndex].title, this.songs[lastIndex].subtitle, this.songs[lastIndex].img, this.songs[lastIndex].path);
    }//else play next song
    else {
      var prevIndex = index - 1;
      this.playSong(this.songs[prevIndex].title, this.songs[prevIndex].subtitle, this.songs[prevIndex].img, this.songs[prevIndex].path);
    }


  }

  //minimize full player view
  minimize() {
    document.getElementById("fullPlayer").style.bottom = "-1000px";
    document.getElementById("miniPlayer").style.bottom = "0px";
  }

  //maximize full player view
  maximize() {
    document.getElementById("fullPlayer").style.bottom = "0px";
    document.getElementById("miniPlayer").style.bottom = "-1000px";
  }

  pause() {
    this.currSong.pause();
    this.isPlaying = false;
  }

  play() {
    this.currSong.play();
    this.isPlaying = true;
  }

  cancel() {
    document.getElementById("miniPlayer").style.bottom = "-100px";
    this.currImage = "";
    this.currTitle = "";
    this.currSubtitle = "";
    this.progress = 0;
    this.currSong.pause();
    this.isPlaying = false;
  }


  //ion touched range
  touchStart() {
    this.isTouched = true;
    this.currRangeTime = Number(this.range.value);
  }

  //ion touched range
  touchMove() {

    this.currSecsText = this.sToTime(this.range.value);
  }


  //ion touched range
  touchEnd() {
    this.isTouched = false;
    this.currSong.currentTime = Number(this.range.value);
    this.currSecsText = this.sToTime(this.currSong.currentTime);
    this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));
    if (this.isPlaying) {
      this.currSong.play();
    }
  }

}
