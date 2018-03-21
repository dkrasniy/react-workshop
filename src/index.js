import React from 'react';
import ReactDOM from 'react-dom';
import App from './workshop/App';

import './index.css';

ReactDOM.render(<App pollInterval={1000}/>, document.getElementById('root'));
