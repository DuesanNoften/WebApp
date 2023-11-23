import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import gMap from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import * as Proj from 'ol/proj';
import GPX from 'ol/format/GPX';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';
import { ApiService } from '../services/ApiService/api.service';

export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;

export const DEFAULT_ZOOM = 10;
export const DEFAULT_ID = '0';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() zoom: number = DEFAULT_ZOOM;
  @Input() width: string | number = DEFAULT_WIDTH;
  @Input() height: string | number = DEFAULT_HEIGHT;
  @Input() idMap: string = DEFAULT_ID;

  @Output() movestart = new EventEmitter<any>();
  @Output() moveend = new EventEmitter<any>();

  map!: gMap;
  data: any;

  constructor(private service: ApiService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const style: any = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: 'rgba(255,255,0,0.4)',
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1,
          }),
        }),
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: '#f30',
          width: 3,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: '#f0f',
          width: 3,
        }),
      }),
    };

    const path: any = { path: this.idMap };
    this.service.getActivityRoute(path).subscribe({
      next: async (resp) => {

        this.data = <JSON>resp.body;
        var vectorSource = new VectorSource({
          url: 'data:text/plain;base64,' + this.data.file.fileContents,
          format: new GPX(),
        });

        this.map = new gMap({
          target: this.idMap,
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              })
            }),
            new VectorLayer({
              source: vectorSource,

              style: (feature) => {
                return style[feature.getGeometry()!.getType()];
              },
            })
          ],
          view: new View({
            center: Proj.fromLonLat([this.data.center[0], this.data.center[1]]),
            zoom: this.zoom
          }),
          controls: defaultControls().extend([])
        });

      },
      error: (error) => {
        console.log(error);
      }
    });

  }

}

