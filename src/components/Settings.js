import React, { Component } from 'react';
import {
  Card,
  Table,
  Checkbox
} from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

import {
  loadRepositoriesConfiguration,
  saveRepositoriesConfiguration
} from '../services/storage';
import ConfirmationModal from './modal/Confirmation';
import AddEditRepositoryModal from './modal/AddEditRepository';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    var repoCOnfig = loadRepositoriesConfiguration();
    console.debug(repoCOnfig);
    this.state = {
      repositories: loadRepositoriesConfiguration(repoCOnfig)
    };
  }

  handleAddEditRepository = (repository) => {
    var repositories = this.state.repositories;
    if (repositories?.length > 0) {
      var index = repositories.map(r => r.label).indexOf(repository.label);
      if (index !== -1) {
        repositories[index] = repository;
      } else {
        repositories.push(repository);
      }
    } else {
      repositories = [repository];
    }
    saveRepositoriesConfiguration(JSON.stringify(repositories));
    this.setState({
      repositories: loadRepositoriesConfiguration()
    });
  };

  handleChangeStatusRepository = (e, data) => {
    var repositories = this.state.repositories;
    if (repositories?.length > 0) {
      var index = repositories.findIndex((r) => r.label === data.label);
      if (index > -1) {
        repositories[index].active = data.checked;
        repositories[index].contentId = uuidv4();
      }
      console.debug('new id: ' + repositories[index].contentId);
      this.setRepositoriesConfiguration(repositories);
    }
  }

  handleDeleteRepository = (label) => {
    var repositories = this.state.repositories;
    if (repositories?.length > 0) {
      var index = repositories.findIndex((r) => r.label === label);
      if (index > -1) {
        repositories.splice(index, 1);
      }
      saveRepositoriesConfiguration(JSON.stringify(repositories));
      this.setRepositoriesConfiguration(repositories);
    }
  };

  setRepositoriesConfiguration = (repositories) => {
    saveRepositoriesConfiguration(JSON.stringify(repositories));
    this.setState({
      repositories: [...repositories]
    });
  }

  render() {
    return (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>Repositories</Card.Header>
            <Table color='orange'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Label</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Pull Request URL</Table.HeaderCell>
                  <Table.HeaderCell>
                    {this.state.repositories?.length > 0 &&
                      <AddEditRepositoryModal callback={this.handleAddEditRepository}>
                        <div className='ui icon button center'>
                          <i className='icon blue add right floated' />
                        </div>
                      </AddEditRepositoryModal>
                    }
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(this.state.repositories?.length < 1) && (
                  <Table.Row>
                    <Table.Cell textAlign="center" colspan="6">
                      <AddEditRepositoryModal callback={this.handleAddEditRepository}>
                        <div className='ui icon button center'>
                          <i className='icon blue add right floated' /> Add Repository Data
                        </div>
                      </AddEditRepositoryModal>
                    </Table.Cell>
                  </Table.Row>)}
                {this.state.repositories?.length > 0 &&
                  this.state.repositories.map((r, i) => (
                    <Table.Row key={r.label}>
                      <Table.Cell>
                        <Checkbox
                          slider
                          checked={r.active}
                          label={r.label}
                          onChange={this.handleChangeStatusRepository} />
                      </Table.Cell>
                      <Table.Cell>{r.type}</Table.Cell>
                      <Table.Cell>{r.label}</Table.Cell>
                      <Table.Cell>{r.description}</Table.Cell>
                      <Table.Cell>{r.baseUrl}</Table.Cell>
                      <Table.Cell>
                        <ConfirmationModal
                          title='Confirm Delete Repository'
                          content={r.label}
                          guid={r.label}
                          callback={this.handleDeleteRepository}
                        >
                          <i className='icon trash right floated blue link' />
                        </ConfirmationModal>
                        <AddEditRepositoryModal
                          repository={r}
                          callback={this.handleAddEditRepository}>
                          <i className='icon blue edit right floated link' />
                        </AddEditRepositoryModal>
                      </Table.Cell>
                    </Table.Row>)
                  )}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}