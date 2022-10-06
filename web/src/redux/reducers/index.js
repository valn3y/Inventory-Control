import { GeneralReducer } from './general-reducer'
import { combineReducers } from 'redux'

export const Reducers = combineReducers({
    general: GeneralReducer
})