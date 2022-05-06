import React from 'react';
import {
    Button,
    Header,
    Icon,
    Modal,
    Form
} from 'semantic-ui-react';
import repositoriesOptions from '../../configurations/repositoriesOptions';

const emptyModalState = {
    open: false,
    active: true,
    label: '',
    type: 'gitlab',
    authorizationHeader: '',
    authorizationHeaderInputTypePassword: false,
    baseUrl: '',
    description: ''
};

export default class AddEditRepositoryModal extends React.Component {
    constructor(props) {
        super(props);
        if (!props.repository) {
            this.state = emptyModalState;
        } else {
            this.state = {
                contentId: props.repository.contentId,
                active: props.repository.active,
                label: props.repository.label,
                type: props.repository.type,
                authorizationHeader: props.repository.authorizationHeader,
                authorizationHeaderInputTypePassword: false,
                baseUrl: props.repository.baseUrl,
                description: props.repository.description
            };
        }
        this.children = props.children;
        this.callback = props.callback;
    }

    setOpen = (b) => {
        this.setState({ open: b });
    };

    viewHeader = () => {
        this.setState({ authorizationHeaderInputTypePassword: !this.state.authorizationHeaderInputTypePassword});
    }

    shouldComponentUpdate(props) {
        if (this.state.contentId !== props.repository?.contentId) {
            this.setState({
                contentId: props.repository?.contentId,
                active: props.repository?.active,
                label: props.repository?.label,
                type: props.repository?.type,
                authorizationHeader: props.repository?.authorizationHeader,
                baseUrl: props.repository?.baseUrl,
                description: props.repository?.description
            });
            console.debug(props.callback);
        }

        return true;
    }

    submit = () => {
        this.callback({
            active: this.state.active,
            label: this.state.label,
            type: this.state.type,
            authorizationHeader: this.state.authorizationHeader,
            baseUrl: this.state.baseUrl,
            description: this.state.description,
        });
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
                <Header icon='archive' content='Add/Edit a Repository' color='orange' />
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input
                                fluid
                                label='Repository Label'
                                placeholder='Label'
                                required={true}
                                value={this.state.label}
                                onChange={(e) => this.setState({ label: e.target.value })} />
                            <Form.Select
                                fluid
                                label='Source'
                                options={repositoriesOptions}
                                defaultValue={this.state.type}
                                onChange={(e, data) => this.setState({ type: data.value })}
                                required={true}
                                placeholder='Repository'
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Authorization Header'
                                placeholder='Bearer/Basic TOKEN'
                                required={true}
                                type={this.state.authorizationHeaderInputTypePassword? 'input': 'password'}
                                value={this.state.authorizationHeader}
                                icon={<i class="circular eye link icon" onClick={this.viewHeader}></i>}
                                onChange={(e) => this.setState({ authorizationHeader: e.target.value })} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label='Base URL'
                                placeholder='https://your_repo_url'
                                required={true}
                                value={this.state.baseUrl}
                                onChange={(e) => this.setState({ baseUrl: e.target.value })} />
                        </Form.Group>
                        <Form.TextArea
                            label='About'
                            placeholder='Short description about the repository'
                            value={this.state.description}
                            onChange={(e) => this.setState({ description: e.target.value })} />
                        <Form.Group>
                            <Form.Checkbox
                                label='Repository Status'
                                slider
                                checked={this.state.active}
                                onChange={(e, data) => this.setState({ active: data.checked })} />
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