import React, { useEffect, useState } from 'react';
import LeafletService from '../../services/leaflet';
import WaypointList from '../../components/WaypointList';
import Map from '../../components/Map';

function RoutePlanner() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!map) {
      setMap(
        new LeafletService({
          id: 'mapid',
          onMarkerAdd: marker => handleCreatePoint(marker),
          onClearAllMarkers: () => handleClearAllMarkers(),
        })
      );
    }
  }, [map, markers]);

  function handleDeleteMarker(point, markerId) {
    map.deleteMarker(point, markerId);
    setMarkers(prevMarkers => [
      ...prevMarkers.filter(marker => marker._leaflet_id !== markerId),
    ]);
  }

  function handleUpdateMarkers(markers) {
    setMarkers([]);
    map.arrangePolyline(markers);
    map.redrawMarkers();
  }

  function handleCreatePoint(markerData) {
    setMarkers(prevMarkers => [
      ...prevMarkers.filter(
        marker => marker._leaflet_id !== markerData._leaflet_id
      ),
      markerData,
    ]);
  }

  function handleClearAllMarkers() {
    console.log('cleared');
    setMarkers([]);
  }

  return (
    <>
      <WaypointList
        waypoints={markers}
        onDeleteMarker={(point, markerId) =>
          handleDeleteMarker(point, markerId)
        }
        onUpdateMarkers={markers => handleUpdateMarkers(markers)}
        onRouteDownload={() =>
          map.download('YourRoute.gpx', 'text/csv;encoding:utf-8')
        }
      />
      <Map markers={markers} />
    </>
  );
}

export default RoutePlanner;
