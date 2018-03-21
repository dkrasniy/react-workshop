import React, {Component} from 'react';
import PropTypes from 'prop-types';

import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import EmailForm from './components/EmailForm';

import './App.css';

const EmailViewWrapper = ({selectedEmail, onClose, onDelete}) => {
    let component = null;

    if (selectedEmail) {

        component = (
            <article className="app__view">
                <EmailView
                    email={selectedEmail}
                    onClose={onClose}
                    onDelete={onDelete}
                />
            </article>
        );
    }

    return component;

}

export default class App extends Component {
    static propTypes = {
        pollInterval: PropTypes.number
    };

    static defaultProps = {
        pollInterval: 2000
    };

    state = {
        emails: [],
        selectedEmailId: -1
    }

    componentDidMount() {
        // the DOM for sure exists!
        this._getUpdatedEmails();
        this._pollID = setInterval(this._getUpdatedEmails,
            this.props.pollInterval)
    }

    componentWillUnmount() {
        //prevent memory leaks
        clearInterval(this._pollID);
    }

    _getUpdatedEmails = () => {
        fetch('//localhost:9090/emails')
            .then((res) => res.json())
            .then((emails) => {
                this.setState({emails});
            })
            .catch((ex) => {
                console.log(ex);
            })
    }

    _handleItemSelect = (selectedEmailId) => {
        // update state (so that the EmailView will show)
        this.setState({selectedEmailId});
    }

    _handleEmailViewClose = () => {
        // We close the email view by resetting the selected email
        this.setState({selectedEmailId: -1});
    }

    _handleFormSubmit = (newEmail) => {

        fetch('//localhost:9090/emails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmail),
        })

            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    throw new Error('Unable to add email');
                } else {
                    this._getUpdatedEmails();
                }
            })
            .catch((ex) => console.log(ex));


    }

    _handleItemDelete = (emailId) => {
        console.log("emailID Deleted:" + emailId);

        fetch(`//localhost:9090/emails/${emailId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    throw new Error('Unable to delete email');
                } else {
                    this._getUpdatedEmails();
                }
            })
            .catch((ex) => console.log(ex));


        this.setState(({emails}) => ({
            // "delete" the email by returning a filtered list that doesn't include it
            emails: emails.filter(email => email.id !== emailId),

            // Also reset `selectedEmailId` since we're deleting it
            selectedEmailId: -1
        }));
    }

    render() {
        let {emails, selectedEmailId} = this.state;
        let selectedEmail = emails.find(email => email.id === selectedEmailId);

        return (
            <main className="app">
                <div className="app__page">
                    <div className="app__list">
                        <EmailList
                            emails={emails}
                            onItemDelete={this._handleItemDelete}
                            onItemSelect={this._handleItemSelect}
                            selectedEmailId={selectedEmailId}
                        />
                    </div>

                    <EmailViewWrapper
                        selectedEmail={selectedEmail}
                        onClose={this._handleEmailViewClose}
                        onDelete={this._handleItemDelete}
                    />

                    <div className="app__form">
                        <EmailForm onSubmit={this._handleFormSubmit}/>
                    </div>
                </div>
            </main>
        );
    }
}
