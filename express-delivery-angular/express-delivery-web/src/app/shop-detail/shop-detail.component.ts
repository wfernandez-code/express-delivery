import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";

//declare const Buffer;
declare var require: any
var Buffer = require('buffer').Buffer

declare var google: any;
const maxI = 50, rad = 24, opac = .6;    


@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {
  public id: any;
  public src:string = 'assets/img/store/';
  public ext:string = '.svg';
  public image:any;
  public whatsapp:any;
  public messenger:any;
  public direction:any;
  public result:any = {
    shop:{},
    pictures:[],
    paymentMethods:[]
  };

  constructor(private route: ActivatedRoute, public api: RestService, 
    private sanitizer: DomSanitizer, private spinner: NgxSpinnerService) {
    this.id = this.route.snapshot.paramMap.get('dbid');
    this.getShop(this.id);
  }

  ngOnInit() {
  }

  async getShop(dbid){
    this.spinner.show();    
    let request =  await this.api.gethttp(`/v1/delivery/${dbid}`) .toPromise(); 
    this.result = request.body;
    this.image = this.getUrl(this.result.pictures);
    this.whatsapp = this.getUrlWhatsApp(this.result.shop)
    this.messenger = this.getUrlMessenger(this.result.shop)
    this.direction = this.getUrlMaps(this.result.shop)
    this.initMap(this.result.shop)
    this.spinner.hide();
  }

  getSanitizer(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getUrlWhatsApp(shop){
    let wa = this.getWhatsApp(shop.code, shop.whatsapp);
    return `https://wa.me/${wa}?text=Buenos%20días%2c%20estoy%20interesado%20en%20adquirir%20sus%20productos.`;
  }

  getUrlMessenger(shop){
    let msg = this.getUserFacebook(shop.facebook);
    return `http://m.me/${msg}`;
  }

  getUrlMaps(shop){
    return `https://www.google.com/maps?q=${shop.lat},${shop.lng}`;
  }

  getUrl(value){
    let url = value.filter((e)=>e.principal);
    let uri = this.getObjectUrl(url[0]);
    return uri;
  }


  getWhatsApp(code, whatsapp){
    let prefix = code.split('+').join('').replace(/ /gi,'');
    return prefix + whatsapp;
  }

  getUserFacebook(page){
    let user = '';
    if(page){
        let value = page.replace(/\/s*$/, "");//Remove last "/"
        value = value.split('/');
        user = value[value.length -1 ];
    }
    return user;
  }

  getObjectUrl(image){
    let def = 'assets/img/store/bag.svg';

    if(image && image.mime_type){
        const bufferBase64 = new Buffer(image.image.data, "base64").toString('binary');
        const byteCharacters = atob(bufferBase64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: image.mimeType});
        return URL.createObjectURL(blob);
    }
    return def;
  }

  initMap(location) {

    let lat = Number(location.lat)
    let ln = Number(location.lng)

          document.getElementById('mapByCity').style.display = 'block';
          let map = new google.maps.Map(document.getElementById('mapByCity'), {
            zoom: 14,
            center: {lat: lat, lng: ln},
            mapTypeId: 'roadmap',
          });

          let locations = [];
          let factor = 10 * 1;
          let i = 0;

          let iconUrl = 'assets/img/store/mercado.svg';
          var icon = {
            url:iconUrl, // url
            scaledSize: new google.maps.Size(35, 35), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };

          while (i < factor) {

            locations.push(new google.maps.LatLng(lat, ln));
            let contentString = `<div><b>${location.name}</b><br/>Descripción: <b>${location.description}</b></div>`;
            let infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            let marker = new google.maps.Marker({
              position: {lat: lat, lng: ln},
              map: map,
              icon: icon
            });

            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });

            i++;

          }


        let analyticsMap = new google.maps.visualization.HeatmapLayer({
          data: locations,
          map: map,
          maxIntensity: maxI,
          radius: rad,
          opacity: opac
        }); 

   }  


}
