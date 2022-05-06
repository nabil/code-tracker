import Bitbucket from '../adapters/Bitbucket';
import Gitlab from '../adapters/Gitlab';
import Github from '../adapters/Github';

const repositoriesOptions = [
    {
        key: 'bitbucket',
        text: 'Bitbucket',
        value: 'bitbucket',
        pullRequestsUri: 'rest/api/latest/dashboard/pull-requests?limit=1000',
        adapter: new Bitbucket()
    },
    {
        key: 'gitlab',
        text: 'GitLab',
        value: 'gitlab',
        pullRequestsUri: 'api/v4/merge_requests?state=all&scope=all',
        adapter: new Gitlab()
    },
    {
        key: 'github',
        text: 'GitHub',
        value: 'github',
        pullRequestsUri: 'pulls?state=all',
        adapter: new Github()
    }
]

export function repoTypePullRequestPath(repository) {
    return repository.baseUrl + "/" + repositoriesOptions.filter(i => i.key === repository.type)[0].pullRequestsUri;
}

export function adapt(repository, data) {
    return repositoriesOptions.filter(i => i.key === repository.type)[0].adapter.adapt(repository, data);
}

export default repositoriesOptions;