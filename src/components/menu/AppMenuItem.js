import './AppMenu.css';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Menu } from 'semantic-ui-react';

export class AppMenuItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      path: props.route.path,
      active: props.currentRoute === props.route.path,
      children: props.children,
    };
  }

  shouldComponentUpdate(props) {
    if (this.state.active !== (this.state.path === props.currentRoute)) {
      this.setState({ active: this.state.path === props.currentRoute });
    }
    return true;
  }

  render() {
    return (
      <Menu.Item
        className={this.state.active ? 'link item active' : 'link item'}
      >
        <NavLink activeClassName='' className='nav-link' to={this.state.path}>
          {this.state.title ? this.state.title : this.state.children}
        </NavLink>
      </Menu.Item>
    );
  }
}
