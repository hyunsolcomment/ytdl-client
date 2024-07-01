import React from 'react';
import ReactDOM from 'react-dom/client';
import './pretendard/pretendard.css';
import './index.css';
import App from './pages/App';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { store } from './store/store';
import FixedLayer from './FixedLayer';

const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <FixedLayer>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </HashRouter>
        </FixedLayer>
    </Provider>
);
