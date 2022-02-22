import { stateTypeRedux } from "../Helper";

const Reducer = (state = [], action) => {
    switch (action.type) {
        case stateTypeRedux.ADD_JOB_NOMOR:
            return [{
                nomor: action.nomor
            }];
        case stateTypeRedux.ADD_CURRENT_MENU:
            return [{
                menu: action.menu
            }];
        default:
            return;
    }
}

export default Reducer;