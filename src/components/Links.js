import React, { Component } from 'react';
import {
  Image,
  Segment,
  Input,
  Divider,
  List
} from 'semantic-ui-react';

import './Links.css';
import { loadLinks, saveLinks } from '../services/storage';
import PagedContent from './PagedContent';
import AddEditLinkModal from './modal/AddEditLink';
import ConfirmationModal from './modal/Confirmation';
import { search } from '../services/search';
import { toDate } from '../services/utils';
import DOMPurify from 'dompurify';

const linksSearchFields = ['title', 'uri'];

const searchFiltersKeys = Object.freeze({
  INPUT: 'input',
  QUICKLINKS: 'quickLinksOnly',
});
const searchFiltersDefaults = new Map([
  [searchFiltersKeys.INPUT, ''],
  [searchFiltersKeys.QUICKLINKS, false],
]);
export default class Links extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFilters: searchFiltersDefaults,
      renderedLinks: this.getRenderedLinks(loadLinks()),
      contentId: crypto.randomUUID(),
    };

    this.linksFileInput = React.createRef();
  }

  setLinks = (data) => {
    this.setState({
      renderedLinks: this.getRenderedLinks([...data]),
      contentId: crypto.randomUUID(),
    });
  };

  handleSelectFileForUpload = () => {
    this.linksFileInput.current.click();
  }

  handleSearch = (e) => {
    var value = e.target.value;
    var newSearchFilters = new Map(this.state.searchFilters);
    newSearchFilters.set(searchFiltersKeys.INPUT, value);
    this.setState({ searchFilters: newSearchFilters }, () =>
      this.applyFilters()
    );
  };

  handleSelectQuickLinksFilter = () => {
    var newSearchFilters = new Map(this.state.searchFilters);
    newSearchFilters.set(
      searchFiltersKeys.QUICKLINKS,
      !this.state.searchFilters.get(searchFiltersKeys.QUICKLINKS)
    );
    this.setState({ searchFilters: newSearchFilters }, () =>
      this.applyFilters()
    );
  };

  applyFilters = () => {
    let result = [];
    if (this.state.searchFilters?.get(searchFiltersKeys.INPUT)?.length > 0) {
      result = search(
        loadLinks(),
        this.state.searchFilters.get(searchFiltersKeys.INPUT),
        linksSearchFields
      );
    } else {
      result = loadLinks();
    }

    if (this.state.searchFilters.get(searchFiltersKeys.QUICKLINKS)) {
      result = result.filter((l) => l.quickLink === true);
    }

    this.setLinks(result);
  };

  handleAddLink = (link) => {
    link.guid = crypto.randomUUID();
    link.dateAdded = new Date().getTime();
    link.lastModified = new Date().getTime();
    link.visible = true;
    var links = loadLinks();
    links.push(link);
    saveLinks(links);
    this.setLinks(links);
  };

  handleEditLink = (link) => {
    var links = loadLinks();
    var index = links.find((l) => l.guid === link.guid);
    index.title = link.title;
    index.uri = link.uri;
    index.description = link.description;
    index.lastModified = new Date().getTime();
    index.visible = true;
    saveLinks(links);
    this.setLinks(links);
  };

  handleDeleteLink = (guid) => {
    var links = loadLinks();
    var index = links.findIndex((l) => l.guid === guid);
    if (index > -1) {
      links.splice(index, 1);
    }
    saveLinks(links);
    this.setLinks(links);
  };

  handleModifyQuickLink = (e) => {
    e.stopPropagation();
    let guid = e.target.attributes.guid.value;
    if (guid) {
      let links = loadLinks();
      let index = links.find((l) => l.guid === guid);
      if (index) {
        index.quickLink =
          index.quickLink !== undefined ? !index.quickLink : true;
        saveLinks(links);
        this.applyFilters();
      }
    }
  };

  handleUploadEvent = (e) => {
    e.preventDefault();
    this.handleUploadLinks(e.target.files[0]);
  };

  handleLoadSampleLinks = () => {
    fetch(process.env.PUBLIC_URL + '/links/links-sample.json')
      .then(response => response.blob())
      .then(file => this.handleUploadLinks(file));
  }

  handleUploadLinks = (file) => {
    const reader = new FileReader();
    var content;
    reader.onload = async (e) => {
      content = e.target.result;
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('unable to parse the json file');
      }
      saveLinks(content);
      this.setLinks(loadLinks());
    };
    reader.readAsText(file);
  };

  handleDownload = (e) => {
    var json = loadLinks(),
      blob = new Blob([json ? json : []], { type: 'application/json' }),
      url = window.URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'links-' + new Date().getTime() + '.json';
    a.click();
  };

  getRenderedLinks = (links) => {
    console.debug(links);
    return links.length > 0 ? links.map((link, i) => (
      <List.Item key={i}>
        <List.Content>
          <ConfirmationModal
            title='Confirm Delete Link'
            content={link.title}
            guid={link.guid}
            callback={this.handleDeleteLink}
          >
            <i className='icon trash right floated blue link' />
          </ConfirmationModal>
          <AddEditLinkModal link={link} callback={this.handleEditLink}>
            <i className='icon blue edit right floated link' />
          </AddEditLinkModal>
          <i
            className={
              'icon blue star ' +
              (link.quickLink ? '' : 'outline') +
              ' right floated link'
            }
            guid={link.guid}
            onClick={this.handleModifyQuickLink}
          />
          {link.iconuri ? (
            <Image
              floated='right'
              className='tiny-image'
              src={DOMPurify.sanitize(link.iconuri)}
            />
          ) : (
            ''
          )}
          <List.Header>
            <a href={DOMPurify.sanitize(link.uri)} target='_blank' rel='noreferrer'>
              {DOMPurify.sanitize(link.title)}
            </a>
          </List.Header>
          <List.Description>
            Added Date: {toDate(link.dateAdded)}
          </List.Description>
        </List.Content>
      </List.Item>
    ))
      : [];
  };

  render() {
    return (
      <Segment attached='top' color='green' className='pageContainer'>
        <div className='ui grid two column very relaxed grid'>
          <div className='twelve wide column'>
            <Input
              fluid
              icon='search'
              placeholder='Search...'
              value={this.state.searchFilters?.get(searchFiltersKeys.INPUT)}
              onChange={this.handleSearch}
            />
          </div>
          <div className='four wide column right aligned'>
            <div
              className={
                this.state.searchFilters.get(searchFiltersKeys.QUICKLINKS)
                  ? 'ui icon button active'
                  : 'ui icon button'
              }
              onClick={this.handleSelectQuickLinksFilter}
            >
              <i className='star green icon'></i>
            </div>
            <div
              className='ui icon button'
              onClick={this.handleSelectFileForUpload}
            >
              <i className='cloud upload green icon'></i>
            </div>
            <div className='ui icon button' onClick={this.handleDownload}>
              <i className='cloud download green icon'></i>
            </div>
            <AddEditLinkModal callback={this.handleAddLink}>
              <div className='ui icon button'>
                <i className='icon blue add right floated'></i>
              </div>
            </AddEditLinkModal>
          </div>
        </div>
        <Divider clearing />
        {this.state.renderedLinks?.length < 1 && (
          <div className='ui icon button' onClick={this.handleLoadSampleLinks}>
            <i className='icon blue add right floated' /> Add Sample Links
          </div>
        )}
        {this.state.renderedLinks?.length > 0 && (
          <PagedContent
            contentId={this.state.contentId}
            elements={this.state.renderedLinks}
          />
        )}
        <div>
          <input
            id='links-file'
            type='file'
            hidden
            accept='application/JSON'
            ref={this.linksFileInput}
            onChange={this.handleUploadEvent}
          ></input>
        </div>
      </Segment >
    );
  }
}
