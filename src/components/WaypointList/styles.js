import styled from 'styled-components';
import { Button, View } from 'wasabi-kit';

const WaypointListContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
`;

const DeleteBtn = styled(Button)`
  padding: 0;
`;

export { DeleteBtn };

export default WaypointListContainer;
