import Links from '../components/Links';
import PullRequests from '../components/pull-requets/PullRequestList';
import Wiki from '../components/Wiki';
import Tickets from '../components/Tickets';
import Settings from '../components/Settings';

const routes = {
    DASHBOARD: { path: "/", title: 'Links', component: Links },
    PULL_REQUESTS: { path: "/pull-requests", title: 'Pull Requests', component: PullRequests },
    WIKI: { path: "/wiki", title: 'Wiki', component: Wiki },
    TICKETS: { path: "/tickets", title: 'Tickets', component: Tickets },
    SETTINGS: { path: "/settings", title: 'Settings', component: Settings }
};

export default routes;