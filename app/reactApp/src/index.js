import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './Store'




ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
