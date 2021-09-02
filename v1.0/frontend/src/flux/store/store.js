import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';


const middlewares = [];
const config = {
    key: 'root',
    storage : AsyncStorage,
}
let reducer = persistCombineReducers(config, rootReducer)

middlewares.push(thunk);
if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
}

export const storeFactory = createStore(
    reducer,
    (process.env.NODE_ENV === 'development') ? composeWithDevTools(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares))
)