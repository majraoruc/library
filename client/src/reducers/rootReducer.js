import { combineReducers } from 'redux';

/* Import individual reducers */
import demoReducer from './demoReducer';

const libraryApp = combineReducers({
    demo: demoReducer
})

export default libraryApp;