import React from 'react';
import {
  Button,
  Header,
  Icon,
  Modal,
  Form,
} from 'semantic-ui-react';

const emptyModalState = { open: false, title: '', uri: '', description: '' };

export default class AddEditLinkModal extends React.Component {
  constructor(props) {
    super(props);
    if (!props.link || !props.link.guid) {
      this.state = emptyModalState;
    } else {
      this.state = {
        guid: props.link.guid,
        title: props.link?.title,
        uri: props.link?.uri,
        description: props.link?.description,
      };
    }
    this.children = props.children;
    this.callback = props.callback;
  }

  setOpen = (b) => {
    if (b === false) {
      this.setState(emptyModalState);
      return;
    }

    this.setState({ open: b });
  };

  submit = () => {
    this.callback({
      guid: this.state.guid,
      title: this.state.title,
      uri: this.state.uri,
      description: this.state.description,
    });
  };

  handleUrlChange = (e) => {
    if (this.state.title?.length < 1 && this.state.open) {
      this.getTitle(e.target.value).then(t => this.setState({ title: t }));
    }
    this.setState({ uri: e.target.value })
  }

  getTitle = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const title = doc.querySelectorAll('title')[0];
    return title.innerText;
  };

  render() {
    return (
      <Modal
        closeIcon
        open={this.state.open}
        trigger={this.children}
        onClose={() => this.setOpen(false)}
        onOpen={() => this.setOpen(true)}
      >
        <Header icon='archive' content='Add/Edit a Link' />
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Input
                required
                label='Title'
                placeholder='Title'
                width={16}
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                required
                placeholder='http://'
                width={16}
                value={this.state.uri}
                onChange={this.handleUrlChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                placeholder='Description'
                width={16}
                value={this.state.description}
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => this.setOpen(false)}>
            <Icon name='remove' /> Cancel
          </Button>
          <Button
            color='green'
            onClick={() => {
              this.submit();
              this.setOpen(false);
            }}
          >
            <Icon name='checkmark' /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}