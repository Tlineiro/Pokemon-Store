import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import {store} from "./components/Redux/store.js";
import AppRouter from './AppRouter.jsx';
import { Provider } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <AppRouter />
        </Provider>
    </StrictMode>
);
