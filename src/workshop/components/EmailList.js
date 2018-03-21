import React, {Component} from 'react';
import PropTypes from 'prop-types';

import EmailListItem from './EmailListItem';
import {EMAIL_PROP_TYPE} from './constants';

import './EmailList.css';

export default class EmailList extends Component {
  static propTypes = {
    emails: PropTypes.arrayOf(EMAIL_PROP_TYPE),
    onItemDelete: PropTypes.func.isRequired,
    onItemSelect: PropTypes.func.isRequired,
      selectedEmailId:PropTypes.number.isRequired,
  };

  render() {
    let {
        emails,
        selectedEmailId,
        onItemSelect,
        onItemDelete
    } = this.props;
    let emailComponents = emails.map(email =>
      <li key={email.id}>
        <EmailListItem
          email={email}
          isSelected={email.id === selectedEmailId}
          onSelect={onItemSelect}
          onDelete={onItemDelete}
        />
      </li>
    );

    return (
      <ul className="email-list">
        {emailComponents}
      </ul>
    );
  }
}
