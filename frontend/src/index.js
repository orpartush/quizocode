import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.scss';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
