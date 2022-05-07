import React, { Component } from 'react';
import {
  Dropdown,
  Checkbox,
  Table,
  Input,
  Divider,
  Segment
} from 'semantic-ui-react';

import PullRequest from './PullRequest';
import { search } from '../../services/search';
import {
  loadPullRequests,
  savePullRequests,
  loadRepositoriesConfiguration
} from '../../services/storage';
import PagedContent from '../PagedContent';
import { parse, repoTypePullRequestPath } from '../../configurations/repositoriesOptions';

const searchFields = ['id', 'fromRepoName', 'title', 'description'];
const filterItems = {
  open: true,
  merged: true,
  declined: true,
  lowComments: true,
  lowUpdates: true,
  noDescription: true,
  repositories: []
}


async function generateHash(p) {
  const encoder = new TextEncoder();
  var hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(p.selfUrl));

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  p.key = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return p;
}

const searchFiltersKeys = Object.freeze({
  INPUT: 'input'
});
const searchFiltersDefaults = new Map([
  [searchFiltersKeys.INPUT, '']
]);
export default class PullRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      filterItems: filterItems,
      searchFilters: searchFiltersDefaults,
      renderedPullRequests: this.renderPullRequests(this.getPullRequests()),
      contentId: crypto.randomUUID()
    };
  }

  componentDidMount() {
    var repositoriesConfiguration = loadRepositoriesConfiguration();
    if (repositoriesConfiguration !== undefined && repositoriesConfiguration !== null) {
      repositoriesConfiguration.forEach(repository => {
        if (repository.active) {
          var filter = { label: repository.label, active: true };
          filterItems.repositories.push(filter);
          this.loadAndSetData(repository);
        }
      });
    }
    this.setState({
      filterItems: filterItems,
      renderedPullRequests: this.renderPullRequests(this.getPullRequests()),
      contentId: crypto.randomUUID(),
    });
  }

  getPullRequests = () => {
    var prs = loadPullRequests();
    if (prs !== undefined && prs !== null) {
      try {
        var pullRequestsMap = new Map(prs);
        return Array.from(pullRequestsMap.values());
      } catch (error) {
        console.error(error);
      }
    }

    return null;
  };

  setPullRequests = (data) => {
    if (data !== undefined) {
      this.setState({
        renderedPullRequests: this.renderPullRequests([...data]),
        contentId: crypto.randomUUID()
      });
    }
  };

  applyFilters = () => {
    let result = [];
    if (this.state.searchFilters?.get(searchFiltersKeys.INPUT)?.length > 0) {
      result = search(
        this.getPullRequests(),
        this.state.searchFilters.get(searchFiltersKeys.INPUT),
        searchFields
      );
    } else {
      result = this.getPullRequests();
    }

    var filtedPullRequests = result.filter(p => (
      ((p.state === 'opened' && this.state.filterItems.open) ||
        (p.state === 'merged' && this.state.filterItems.merged) ||
        (p.state === 'declined' && this.state.filterItems.declined)) &&
      // (p.lowComments === this.state.filterItems.lowComments ||
      //   p.lowUpdates === this.state.filterItems.lowUpdates ||
      //   p.noDescription === this.state.filterItems.noDescription) &&
      this.state.filterItems.repositories.some(r => {
        return r.label === p.repositoryConfigLabel && r.active;
      })
    ));
    console.debug(filtedPullRequests);
    this.setPullRequests(filtedPullRequests);
  };

  fetchPullRequests = (repository, requestOptions) =>
    fetch(repoTypePullRequestPath(repository), requestOptions)
      .then((response) => response.text())
      .then((result) => {
        var data = JSON.parse(result);
        if (data !== undefined && data.values) {
          return parse(repository, data);
        };
      })
      .then(pullRequests => Promise.all(pullRequests.map(p => generateHash(p))));

  loadAndSetData = (repository) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', repository.authorizationHeader);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    this.fetchPullRequests(repository, requestOptions)
      .then(pull_requests => {
        var pr = loadPullRequests();
        var storedPullRequestsMap;
        if (pr === null || pr === 'null' || pr === undefined) {
          storedPullRequestsMap = new Map();
        } else {
          storedPullRequestsMap = new Map(pr);
        }

        pull_requests.forEach(p => storedPullRequestsMap.set(p.key, p));
        savePullRequests([...storedPullRequestsMap]);
        this.setPullRequests(pull_requests);
      })
      .catch((error) => console.error('error', error));
  };

  handleSearch = (e) => {
    var value = e.target.value;
    var newSearchFilters = new Map(this.state.searchFilters);
    newSearchFilters.set(searchFiltersKeys.INPUT, value);
    this.setState({ searchFilters: newSearchFilters }, () =>
      this.applyFilters()
    );
  };

  toggleFilter = () => {
    this.setState({ filterOpen: !this.state.filterOpen });
  }

  doNothing = (e) => {
    e.stopPropagation();
  }

  handleFilterChange = (e, data) => {
    e.stopPropagation();
    let newFilterItems = this.state.filterItems;
    newFilterItems[data.guid] = data.checked;
    this.setState({ filterItems: newFilterItems }, () => this.applyFilters());
  }

  handleRepositoryFilterChange = (e, data) => {
    let newFilterItems = this.state.filterItems;
    newFilterItems.repositories[data.index].active = data.checked;
    this.setState({ filterItems: newFilterItems }, () => this.applyFilters());
  }

  renderPullRequests = (pullRequests) => {
    console.debug(pullRequests);
    var renderedPullRequests = [];
    if (pullRequests !== undefined && pullRequests !== null && pullRequests.length > 0) {
      renderedPullRequests = pullRequests.map((item, i) => (
        <PullRequest
          key={item.selfUrl}
          id={item.id}
          kid={item.selfUrl}
          title={item.title}
          description={item.description}
          createdDate={item.createdDate}
          updatedDate={item.updatedDate}
          author={item.author}
          repositoryConfigType={item.repositoryConfigType}
          repositoryConfigLabel={item.repositoryConfigLabel}
          closed={item.closed}
          open={item.open}
          state={item.state}
          version={item.version}
          comments={item.comments}
          fromRepoName={item.fromRepoName}
          fromRepoLink={item.fromRepoLink}
          toRepoName={item.toRepoName}
          toRepoLink={item.ToRepoLink}
          lastCommitLink={item.lastCommitLink}
          fromDisplayId={item.fromDisplayId}
          toDisplayId={item.toDisplayId}
          selfUrl={item.selfUrl}
          reviewers={item.reviewers} />));
    }
    return renderedPullRequests;
  }

  render() {
    return (
      <Segment attached='top' color='orange' className='page-container'>
        <div className='ui grid two column grid'>
          <div className='fourteen wide column'>
            <Input
              fluid
              icon='search'
              placeholder='Search...'
              onChange={this.handleSearch}
            />
          </div>
          <div className='two wide column'>
            <Dropdown
              text='...'
              icon='filter'
              floating
              labeled
              button
              disabled={this.state.filterItems.repositories?.length < 1}
              open={this.state.filterOpen}
              upward={false}
              className='icon'
              direction='left'
              onClick={this.toggleFilter}
            >
              <Dropdown.Menu>
                <Dropdown.Header icon='tags' content='Status' />
                <Table compact celled definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={'one'}>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.open}
                          guid={'open'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>Open</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.merged}
                          guid={'merged'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>Merged</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.declined}
                          guid={'declined'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>Declined</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <Dropdown.Header icon='tags' content='Metrics' />
                <Table compact celled definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.lowComments}
                          guid={'lowComments'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>Low Comments</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.lowUpdates}
                          guid={'lowUpdates'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>Low Updates</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox
                          toggle
                          checked={this.state.filterItems.noDescription}
                          guid={'noDescription'}
                          onClick={this.handleFilterChange}
                        />
                      </Table.Cell>
                      <Table.Cell>No Description</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <Dropdown.Header icon='tags' content='Repositories' />
                <Table compact celled definition>
                  <Table.Body>
                    {this.state.filterItems.repositories.map((r, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          <Checkbox
                            toggle
                            checked={this.state.filterItems.repositories[i].active}
                            index={i}
                            onClick={this.handleRepositoryFilterChange}
                          />
                        </Table.Cell>
                        <Table.Cell>{r.label}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Divider clearing />
        <PagedContent
          elements={this.state.renderedPullRequests}
          contentId={this.state.contentId}
        />
      </Segment >
    );
  }
}


