export default class Gitlab {
    adapt(repository, data) {
        return data.map(p => {
            let lastCommitLink = p.fromRef?.repository.links.self[0].href.substring(0, p.fromRef?.repository.links.self[0].href.length - 7) + '/commits/' + p.fromRef?.latestCommit;
            return {
                "id": p.number,
                "title": p.title,
                "description": p.body,
                "createdDate": new Date(p.created_at).getTime(),
                "updatedDate": new Date(p.updated_at).getTime(),
                "author": p.user.login,
                "repositoryConfigType": repository.type,
                "repositoryConfigLabel": repository.label,
                "closed": p.state === 'closed',
                "open": p.state === 'open',
                "state": p.merged_at? 'merged': p.state === 'open'? 'opened': p.state,
                "version": p.version,
                "comments": p.user_notes_count,
                "fromRepoName": p.head.repo.full_name,
                "fromRepoLink": p.head.repo.url,
                "toRepoName": p.base.repo.full_name,
                "toRepoLink": p.base.repo.url,
                "lastCommitLink": lastCommitLink,
                "fromDisplayId": p.head.ref,
                "toDisplayId": p.base.ref,
                "selfUrl": p.url,
                "reviewers": p.requested_reviewers.map(r => (
                    {}))
            };
        });
    }
}

