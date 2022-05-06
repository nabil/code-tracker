import React from 'react';
import PullRequest, { PR_STATUS } from '../components/pull-requets/PullRequest';

export default {
  component: PullRequest,
  title: 'CodeTracker/PullRequest',
};

const Template = (args) => <PullRequest {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 88,
  title: 'Awesome Pull Request',
  description: 'Description',
  createdDate: new Date().getTime() - (7 * 60 * 36000),
  updatedDate: new Date().getTime(),
  nbHoursSinceCreated: 10,
  nbHoursSinceCosed: 15,
  nbHoursOpened: 10,
  author: 'item.author',
  closed: false,
  state: 'OPEN',
  version: 3,
  comments: 4,
  fromRepoName: 'Code Tracker Fork Repository',
  fromRepoLink: 'item.fromRepoLink',
  toRepoName: 'Code Tracker Fork Repository',
  toRepoLink: 'item.ToRepoLink',
  lastCommitLink: 'item.lastCommitLink',
  fromDisplayId: 'feature/add-storybook',
  toDisplayId: 'feature/add-storybook',
  selfUrl: 'https://localhost/88',
  reviewers: [
    { approved: true, displayName: 'Nabil M', avatar: 'https://avatars.githubusercontent.com/u/125379?v=4' },
    { approved: true, displayName: 'Omar', avatar: 'https://avatars.githubusercontent.com/u/96662404?v=4' }
  ]
};

export const MergedNeat = Template.bind({});
MergedNeat.args = {
  ...Default.args,
  closed: true,
  state: 'MERGED'
};

export const MergedEarly = Template.bind({});
MergedEarly.args = {
  ...Default.args,
  closed: true,
  state: 'MERGED',
  createdDate: new Date().getTime() - (3 * 60 * 36000)
};

export const MergedLowComments = Template.bind({});
MergedLowComments.args = {
  ...Default.args,
  closed: true,
  state: 'MERGED',
  comments: 1
};

export const MergedLowUpdate = Template.bind({});
MergedLowUpdate.args = {
  ...Default.args,
  closed: true,
  state: 'MERGED',
  version: 2
};

export const Declined = Template.bind({});
Declined.args = {
  ...Default.args,
  closed: true,
  state: 'DECLINED'
};