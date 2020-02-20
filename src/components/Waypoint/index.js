import React from 'react';
import { Button, View, Icon } from 'wasabi-kit';

function Waypoint() {
  const { name } = props;
  return (
    <View>
      {name}
      <Button>
        <Icon iFont="fa" icon="bomb" />
      </Button>
    </View>
  );
}

export default Waypoint;
