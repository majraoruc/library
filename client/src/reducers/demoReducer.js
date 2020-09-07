const initialState = { };

const demoReducer = (state = initialState, action) => {
    switch (action.type) {
        /* Default state, if no action was matched */
        default:
            return state;
    }
}

export default demoReducer;