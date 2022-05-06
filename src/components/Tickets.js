import React, { Component } from 'react';
import {
  Image,
  Input,
  Divider,
  Grid,
  List,
  Pagination,
  Select,
  Segment,
} from 'semantic-ui-react';
import { search } from '../services/search';

const pageSizeOptions = [
  { key: '10', value: '10', text: '10' },
  { key: '20', value: '20', text: '20' },
  { key: '50', value: '50', text: '50' },
];

const searchFields = ['title', 'description'];
const START_PAGE = 1;

export default class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      pageSize: props.pageSize ? props.pageSize : 20,
      totalItems: 0,
      totalPages: 0,
      currentPage: START_PAGE,
    };

    this.linksFileInput = React.createRef();
    this.toDate = this.toDate.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
  }

  componentDidMount() {
    this.loadAndSetData();
  }

  getTickets = () => {
  };

  loadAndSetData() {
    var tickets = this.getTickets();
    if (tickets) {
      this.setTickets(tickets);
    }
  }

  setTickets = (data) => {
    this.setState({
      links: [...data],
      totalItems: data.length,
      totalPages: Math.floor(data.length / this.state.pageSize) + 1,
    });
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ currentPage: activePage });
  };

  setPageSize = (e) => {
    var newPageSize = parseInt(e.target.outerText);
    this.setState({
      pageSize: newPageSize,
      totalPages: Math.floor(this.state.totalItems / newPageSize) + 1,
    });
  };

  handleSearch = (e) => {
    var value = e.target.value;
    if (value !== undefined && value.length > 0) {
      this.setLinks(search(this.getTickets(), value, searchFields));
      this.setState({ currentPage: START_PAGE });
    } else {
      this.loadAndSetData();
    }
  };

  toDate(v) {
    return new Date(v / 1000).toUTCString();
  }

  render() {
    const pos = (this.state.currentPage - 1) * this.state.pageSize;
    const tickets = this.state.tickets.slice(pos, pos + this.state.pageSize);
    const renderTable =
      tickets.length > 0 &&
      tickets.map((t, i) => (
        <List.Item key={i}>
          {t.iconuri ? <Image size='mini' src={t.iconuri} /> : ''}
          <List.Content>
            <List.Header as='a' href={t.uri} target='_blank'>
              {t.title}
            </List.Header>
            <List.Description>
              Added Date: {this.toDate(t.dateAdded)}
            </List.Description>
          </List.Content>
        </List.Item>
      ));

    return (
      <Segment attached='top' color='red'>
        <div className='ui grid two column very relaxed grid'>
          <div className='thirteen wide column'>
            <Input
              fluid
              icon='search'
              placeholder='Search...'
              onChange={this.handleSearch}
            />
          </div>
          <div className='three wide column right aligned'>
            <div className='ui icon button' onClick={this.selectFileForUpload}>
              <i className='cloud folder green icon'></i>
            </div>
            <div className='ui icon button' onClick={this.download}>
              <i className='cloud file green icon'></i>
            </div>
          </div>
        </div>
        <Divider clearing />
        <List>{renderTable}</List>
        <Grid columns='three'>
          <Grid.Row>
            <Grid.Column width={4}></Grid.Column>
            <Grid.Column width={8}>
              <Pagination
                activePage={this.state.currentPage}
                totalPages={this.state.totalPages}
                onPageChange={this.handlePaginationChange}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <Select
                  id='page-size-select'
                  name='page-size-select'
                  placeholder='Page Size'
                  onChange={this.setPageSize}
                  defaultValue={this.state.pageSize}
                  options={pageSizeOptions}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
