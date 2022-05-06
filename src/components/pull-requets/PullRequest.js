import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './pullrequest.css';
import { toDate } from '../../services/utils';
import { Image, Card } from 'semantic-ui-react';

export const PR_STATUS = {
  OPEN: { label: 'Open', color: 'orange' },
  MERGED: { label: 'Merged', color: 'green' },
  DECLINED: { label: 'Declined', color: 'red' },
  CLOSED: { label: 'Closed', color: 'green' },
  NEEDS_WORK: { label: 'Needs Work', color: 'orange' },
};

const MIN_COMMENTS = 4;
const MIN_VERSIONS = 2;
const MIN_HOURS_OPEN = 4;

export default class PullRequest extends Component {
  constructor(props) {
    super(props);
    console.debug('repo type: ' + props.repositoryConfigType);
    this.state = {
      id: props.id,
      kid: props.kid,
      title: props.title,
      description: props.description,
      createdDate: props.createdDate,
      updatedDate: props.updatedDate,
      nbHoursSinceCreated: Math.ceil(
        parseFloat((new Date().getTime() - props.createdDate) / (3600 * 1000))
      ),
      nbHoursSinceClosed: Math.ceil(
        parseFloat((new Date().getTime() - props.updatedDate) / (3600 * 1000))
      ),
      nbHoursOpened: Math.ceil(
        parseFloat((props.updatedDate - props.createdDate) / (3600 * 1000))
      ),
      author: props.author,
      repositoryConfigType: props.repositoryConfigType,
      repositoryConfigLabel: props.repositoryConfigLabel,
      closed: props.closed,
      state: props.state,
      version: props.version,
      comments: props.comments ? props.comments : 0,
      fromRepoName: props.fromRepoName,
      fromRepoLink: props.fromRepoLink,
      toRepoName: props.toRepoName,
      toRepoLink: props.ToRepoLink,
      lastCommitLink: props.lastCommitLink,
      fromDisplayId: props.fromDisplayId,
      toDisplayId: props.toDisplayId,
      status: props.state === 'opened'
        ? PR_STATUS.OPEN
        : props.state === 'merged' ? PR_STATUS.MERGED
          : props.state === 'declined' ? PR_STATUS.DECLINED : PR_STATUS.CLOSED,
      selfUrl: props.selfUrl,
      reviewers: props.reviewers,
    };
  }

  render() {
    return (
      <Card fluid key={this.state.kid}>
        <Card.Content color='red'>
          <div className='ui two column grid'>
            <div className='fifteen wide column'>
              <Card.Header>
                <a
                  href={this.state.selfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.state.id}
                </a>{' '}
                |{' '}
                <a
                  href={this.state.fromRepoLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.state.fromRepoName}
                </a>{' '}
                |{' '}
                <a
                  href={this.state.selfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.state.title}
                </a>
              </Card.Header>
              <Card.Meta>
                Created on <b>{toDate(this.state.createdDate)}</b> | Last Update
                on:
                <b>{toDate(this.state.updatedDate)}</b> |{' '}
                {this.state.status.label} since:
                {!this.state.closed && <b>{this.state.nbHoursSinceCreated}</b>}
                {this.state.closed && (
                  <b>{this.state.nbHoursSinceClosed}</b>
                )}{' '}
                Hours
              </Card.Meta>
              <Card.Description>
                From:
                <a
                  href={this.state.lastCommitLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.state.fromRepoName}/{this.state.fromDisplayId}
                </a>
                <br />
                To:
                <a
                  href={this.state.toRepoLink}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.state.toRepoName}/{this.state.toDisplayId}
                </a>
                <br />
                Author: <b>{this.state.author}</b> |
                Comments:
                <b>{this.state.comments}</b> | Version:{' '}
                <b>{this.state.version}</b>
              </Card.Description>
            </div>
            <div className='one wide column'>
              {this.state.repositoryConfigLabel &&
                (<i className='ui white right ribbon label'>
                  <Image src={'/images/' + this.state.repositoryConfigType + '.png'} className='tiny-image' avatar={true} /> &nbsp;
                  {this.state.repositoryConfigLabel}</i>)}
              <p />
              <i
                className={'ui ' + this.state.status.color + ' right ribbon label'}
              >
                {this.state.status.label}
              </i>
              <p></p>
              {this.state.status !== PR_STATUS.OPEN &&
                this.state.nbHoursOpened < MIN_HOURS_OPEN && (
                  <i className={'ui red right ribbon label'}>Too Fast!</i>
                )}
              <p></p>
              {this.state.comments < MIN_COMMENTS && (
                <i className={'ui yellow right ribbon label'}>Low Comments</i>
              )}
              <p></p>
              {this.state.version <= MIN_VERSIONS && (
                <i className={'ui yellow right ribbon label'}>Low Updates</i>
              )}
              <p></p>
              {!this.state.description && (
                <i className={'ui yellow right ribbon label'}>No Description</i>
              )}
              <p></p>
            </div>
          </div>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two column grid'>
            <div className='fifteen wide column'>
              <pre className='pr-description'>{this.state.description}</pre>
            </div>
            <div className='one wide column'></div>
          </div>
        </Card.Content>
        <Card.Content extra>
          {this.state.reviewers.map((r, i) => (
            <a key={i} title={r.displayName} href={r.profile} className='reviewer-icon'>
              <Image src={r.avatar} avatar={true}></Image>
              {r.approved && (
                <i className='approval-status thumbs up icon green small' />
              )}
              {!r.approved && r.status === 'NEEDS_WORK' && (
                <i className='approval-status thumbs up icon orange small' />
              )}
            </a>
          ))}
        </Card.Content>
      </Card>
    );
  }
}

PullRequest.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  createdDate: PropTypes.number,
  updatedDate: PropTypes.number,
  nbHoursSinceCreated: PropTypes.number,
  nbHoursSinceClosed: PropTypes.number,
  author: PropTypes.string,
  closed: PropTypes.bool,
  state: PropTypes.string,
  version: PropTypes.number,
  comments: PropTypes.number,
  fromRepoName: PropTypes.string,
  fromRepoLink: PropTypes.string,
  toRepoName: PropTypes.string,
  toRepoLink: PropTypes.string,
  lastCommitLink: PropTypes.string,
  fromDisplayId: PropTypes.string,
  toDisplayId: PropTypes.string,
  selfUrl: PropTypes.string,
  reviewers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PullRequest.defaultProps = {
  closed: false,
};
