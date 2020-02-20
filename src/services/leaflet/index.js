import L from 'leaflet';
import React from 'react';

const outdoors = L.tileLayer(
  'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=af071baf070341ad86b5100adeec252b',
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
);

const hikebike = L.tileLayer(
  'http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
);

const satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    maxZoom: 19,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
);

class LeafletMap {
  constructor(args) {
    const { id } = args;
    this.mid = 0;
    this.nextpoint = 0;
    this.nextlatlng = '';
    this.newpoint = '';

    this.map = L.map(id, {
      center: [46.58693083138473, 11.904845237731934],
      zoom: 15,
      layers: [outdoors],
    });

    this.polyline = L.polyline([]).addTo(this.map);
    this.marker = null;
    this.baseLayers = {
      outdoors,
      satellite,
      hikebike,
    };

    this.onMarkerAdd = args.onMarkerAdd;
    this.onClearAllMarkers = args.onClearAllMarkers;

    this.map.on('contextmenu', e => this.onMapClick(e));

    L.control.layers(this.baseLayers).addTo(this.map);
    this.markerGroup = L.layerGroup().addTo(this.map);
  }

  onMapClick(e) {
    const newMarker = new L.marker(e.latlng, {
      draggable: 'true',
      icon: L.divIcon({
        className: 'leaflet-circle-marker',
        html: this.polyline.getLatLngs().length,
        iconAnchor: [20, 20],
      }),
    }).addTo(this.markerGroup);

    if (this.onMarkerAdd) {
      this.onMarkerAdd(newMarker);
    }

    newMarker
      .on('dragstart', () => this.dragStartHandler(newMarker))
      .on('click', () => this.dragStartHandler(newMarker))
      .on('drag', () => this.dragHandler(newMarker))
      .on('dragend', () => this.dragEndHandler(newMarker));

    this.polyline.addLatLng(L.latLng(e.latlng));
    this.map.setView(e.latlng);
  }

  dragStartHandler(marker) {
    const latlngs = this.polyline.getLatLngs();
    const latLng = marker.getLatLng();

    for (let i = 0; i < latlngs.length; i++) {
      if (latLng.equals(latlngs[i])) {
        marker.polylineLatlng = i;
        this.nextpoint = i - 1;
        if (this.nextpoint < 0) {
          this.nextpoint = 0;
        }
        this.nextlatlng = latlngs[this.nextpoint];
        let bounds = L.latLngBounds(latLng, this.nextlatlng);
        this.newpoint = bounds.getCenter();
      }
    }
  }

  dragHandler(marker) {
    const locations = this.polyline.getLatLngs();
    const latLng = marker.getLatLng();
    locations.splice(marker.polylineLatlng, 1, latLng);
    this.polyline.setLatLngs(locations);
  }

  dragEndHandler(marker) {
    delete marker.polylineLatlng;
  }

  deleteMarker(mypoint, myid) {
    this.markerGroup.removeLayer(myid);
    const latlngs = this.polyline.getLatLngs();
    latlngs.splice(mypoint, 1);
    this.polyline.setLatLngs(latlngs);
    this.redrawMarkers();
  }

  arrangePolyline(markers) {
    console.log('arranged');
    this.polyline.setLatLngs(markers.map(marker => marker.getLatLng()));
  }

  redrawMarkers() {
    this.markerGroup.clearLayers();
    const latlngs = this.polyline.getLatLngs();

    if (this.onClearAllMarkers) {
      this.onClearAllMarkers();
    }

    for (let i = 0; i < latlngs.length; i++) {
      let newMarker = new L.marker(latlngs[i], {
        draggable: 'true',
        icon: L.divIcon({
          className: 'leaflet-circle-marker',
          html: i,
          iconAnchor: [20, 20],
        }),
      }).addTo(this.markerGroup);

      if (this.onMarkerAdd) {
        this.onMarkerAdd(newMarker);
      }

      newMarker
        .on('dragstart', () => this.dragStartHandler(newMarker))
        .on('click', () => this.dragStartHandler(newMarker))
        .on('drag', () => this.dragHandler(newMarker))
        .on('dragend', () => this.dragEndHandler(newMarker));
    }
  }

  download(fileName, mimeType) {
    const timestamp = new Date().toLocaleString('en-GB');
    let gpxtrack =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<gpx xmlns="http://www.topografix.com/GPX/1/1"  creator="komoot" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n<trk><name>' +
      timestamp +
      '</name>\n<trkseg>\n';
    let latlngs = this.polyline.getLatLngs();
    let lastpoint = latlngs[0];

    for (let i = 0; i < latlngs.length; i++) {
      lastpoint = latlngs[i];
      gpxtrack +=
        '<trkpt lat="' +
        latlngs[i].lat +
        '" lon="' +
        latlngs[i].lng +
        '"></trkpt>\n';
    }
    gpxtrack += '</trkseg>\n</trk>\n</gpx>\n ';
    const a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) {
      // IE10
      navigator.msSaveBlob(
        new Blob([gpxtrack], {
          type: mimeType,
        }),
        fileName
      );
    } else if (URL && 'download' in a) {
      //html5 A[download]
      a.href = URL.createObjectURL(
        new Blob([gpxtrack], {
          type: mimeType,
        })
      );
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href =
        'data:application/octet-stream,' + encodeURIComponent(gpxtrack);
    }
  }
}

export default LeafletMap;
