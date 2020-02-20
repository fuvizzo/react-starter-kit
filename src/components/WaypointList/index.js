import React, { useEffect, useState } from 'react';
import { Button, Icon, Text, View } from 'wasabi-kit';
import WaypointListContainer, { DeleteBtn } from './styles';
import arrayMove from 'array-move';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

function WaypointList(props) {
  const { onDeleteMarker, onUpdateMarkers, onRouteDownload } = props;
  const [waypoints, setWaypoints] = useState(props.waypoints);

  useEffect(() => {
    console.log('rerender', waypoints);
    setWaypoints(props.waypoints);
  }, [props.waypoints]);

  const Waypoint = SortableElement(({ value, sortIndex }) => (
    <View padding={10} align="center" justify="space-between">
      <View align="center">
        <DragHandleElement />
        <Text
          style={{ marginLeft: 10 }}
          type="p1.w"
        >{`Waypoint ${value._leaflet_id}`}</Text>
      </View>
      <DeleteBtn
        noanim
        type="transparent"
        onClick={() => onDeleteMarker(sortIndex, value._leaflet_id)}
      >
        <Icon font="fa" name="trash" size={22} color="text" />
      </DeleteBtn>
    </View>
  ));

  const DragHandleElement = SortableHandle(() => (
    <Icon font="fa" name="bars" size={22} color="text" />
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <ul>
        {items.map((value, index) => (
          <Waypoint
            key={`item-${index}`}
            index={index}
            value={value}
            sortIndex={index}
            align="center"
            justify="space-between"
          />
        ))}
      </ul>
    );
  });

  function onSortEnd({ oldIndex, newIndex }) {
    setWaypoints(items => {
      const arrangedMarkers = arrayMove(items, oldIndex, newIndex);
      onUpdateMarkers(arrangedMarkers);
      return arrangedMarkers;
    });
  }

  return (
    <WaypointListContainer direction="column" type="nori">
      <Text style={{ padding: 10 }} type="h1.w">
        Route Builder
      </Text>
      <SortableList useDragHandle items={waypoints} onSortEnd={onSortEnd} />
      <a download="YourRoute">
        <Button download="MyTracks.gpx" type="wasabi" onClick={onRouteDownload}>
          Download your Route
        </Button>
      </a>
    </WaypointListContainer>
  );
}

export default WaypointList;
