import C from '../actions/constants';

export default function (state={}, action) {
    switch(action.type) {
        case C.GET_STUDENTS_EXAMS_LIST:
            return action.payload;
        default:
            return state;
    }
}