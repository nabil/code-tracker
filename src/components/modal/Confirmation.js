import React from 'react';
import {
  Button,
  Header,
  Icon,
  Modal
} from 'semantic-ui-react';

export default function ConfirmationModal(props) {
  const [open, setOpen] = React.useState(false);
  const guid = props.guid;
  const title = props.title;
  const content = props.content;
  const children = props.children;
  const callback = props.callback;

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={children}
    >
      <Header icon>
        <Icon name='archive' />
        {title}
      </Header>
      <Modal.Content>
        <p>{content}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button
          color='green'
          inverted
          onClick={() => {
            setOpen(false);
            callback(guid);
          }}
        >
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}