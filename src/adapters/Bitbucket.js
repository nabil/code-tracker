export default class Bitbucket {
    adapt(repository, data) {
        return data.values.map(p => {
            let lastCommitLink = p.fromRef.repository.links.self[0].href.substring(0, p.fromRef.repository.links.self[0].href.length - 7) + '/commits/' + p.fromRef.latestCommit;
            return {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "createdDate": p.createdDate,
                "updatedDate": p.updatedDate,
                "author": p.author?.user?.displayName,
                "repositoryConfigType": repository.type,
                "repositoryConfigLabel": repository.label,
                "closed": p.closed,
                "open": !p.closed,
                "state": p.state?.toLowerCase(),
                "version": p.version,
                "comments": p.properties.commentCount,
                "fromRepoName": p.fromRef.repository.project.name,
                "fromRepoLink": p.fromRef.repository.project.links.self[0].href,
                "toRepoName": p.toRef.repository.project.name,
                "toRepoLink": p.toRef.repository.project.links.self[0].href,
                "lastCommitLink": lastCommitLink,
                "fromDisplayId": p.fromRef.displayId,
                "toDisplayId": p.toRef.displayId,
                "selfUrl": p.links?.self[0].href,
                "reviewers": p.reviewers.map(r => (
                    {
                        approved: r.approved,
                        status: r.status,
                        displayName: r.user.displayName,
                        profile: r.user.links.self[0].href,
                        avatar: r.user.links.self[0].href + '/avatar.png'
                    }))
            };
        });
    }
};