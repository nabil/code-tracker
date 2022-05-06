import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import routes from '../../configurations/routes';
import DOMPurify from 'dompurify';
import './AppMenu.css';

import {
  Container,
  Dropdown,
  Image,
  Menu,
  Visibility,
} from 'semantic-ui-react';
import { loadLinks } from '../../services/storage';

import { AppMenuItem } from './AppMenuItem';

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: 'rgba(220, 233, 243)',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};

class AppMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuFixed: false,
      overlayFixed: false,
      currentRoute: props.location.pathname,
      quickLinks: this.getQuickLinks(),
    };
  }

  shouldComponentUpdate(props) {
    if (this.state.currentRoute !== props.location.pathname) {
      this.setState({ currentRoute: props.location.pathname });
    }
    return true;
  }

  handleOverlayRef = (c) => {
    const { overlayRect } = this.state;

    if (!overlayRect) {
      this.setState({
        overlayRect: _.pick(c.getBoundingClientRect(), 'height', 'width'),
      });
    }
  };

  stickOverlay = () => this.setState({ overlayFixed: true });

  stickTopMenu = () => this.setState({ menuFixed: true });

  unStickOverlay = () => this.setState({ overlayFixed: false });

  unStickTopMenu = () => this.setState({ menuFixed: false });

  getQuickLinks = () => {
    return loadLinks().filter((l) => l.quickLink === true);
  };

  updateQuickLinks = (e) => {
    e.stopPropagation();
    let links = this.getQuickLinks();
    this.setState({ quickLinks: [...links] });
  };

  render() {
    const { menuFixed } = this.state;

    return (
      <Visibility
        onBottomPassed={this.stickTopMenu}
        onBottomVisible={this.unStickTopMenu}
        once={false}
      >
        <Menu
          borderless
          fixed={menuFixed ? 'top' : undefined}
          style={menuFixed ? fixedMenuStyle : menuStyle}
        >
          <Container>
            <Menu.Item>
              <Image size='mini' src='/logo.png' />
            </Menu.Item>

            <AppMenuItem
              title={routes.DASHBOARD.title}
              currentRoute={this.state.currentRoute}
              route={routes.DASHBOARD}
            />
            <AppMenuItem
              title={routes.PULL_REQUESTS.title}
              currentRoute={this.state.currentRoute}
              route={routes.PULL_REQUESTS}
            />
            {/* <AppMenuItem
              title={routes.WIKI.title}
              currentRoute={this.state.currentRoute}
              route={routes.WIKI}
            />
            <AppMenuItem
              title={routes.TICKETS.title}
              currentRoute={this.state.currentRoute}
              route={routes.TICKETS}
            /> */}

            <Menu.Menu position='right'>
              <Dropdown
                text='Quick Links'
                className='link item'
                onClick={this.updateQuickLinks}
              >
                <Dropdown.Menu>
                  {this.state.quickLinks.map((l, i) => (
                    <Dropdown.Item key={i}>
                      <a href={DOMPurify.sanitize(l.uri)} target='_blank' rel='noreferrer'>
                        {DOMPurify.sanitize(l.title?.length <= 80
                          ? l.title
                          : l.title.substring(0, 77) + '...')}
                      </a>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
            <AppMenuItem
              currentRoute={this.state.currentRoute}
              route={routes.SETTINGS}
              position='right'
            >
              <i className='icon cog' />
            </AppMenuItem>
          </Container>
        </Menu>
      </Visibility>
    );
  }
}

export default withRouter(AppMenu);
