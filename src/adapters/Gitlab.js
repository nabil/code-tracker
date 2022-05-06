export default class Gitlab {
    adapt(repository, data) {
        return data.map(p => {
            let lastCommitLink = p.fromRef?.repository.links.self[0].href.substring(0, p.fromRef?.repository.links.self[0].href.length - 7) + '/commits/' + p.fromRef?.latestCommit;
            return {
                "id": p.iid,
                "title": p.title,
                "description": p.description,
                "createdDate": new Date(p.created_at).getTime(),
                "updatedDate": new Date(p.updated_at).getTime(),
                "author": p.author.name,
                "repositoryConfigType": repository.type,
                "repositoryConfigLabel": repository.label,
                "closed": p.state === 'closed',
                "open": p.state === 'opened',
                "state": p.state,
                "version": p.version,
                "comments": p.user_notes_count,
                "fromRepoName": '',
                "fromRepoLink": '',
                "toRepoName": '',
                "toRepoLink": '',
                "lastCommitLink": lastCommitLink,
                "fromDisplayId": '',
                "toDisplayId": '',
                "selfUrl": p.web_url,
                "reviewers": p.reviewers.map(r => (
                    {}))
            };
        });
    }
}

