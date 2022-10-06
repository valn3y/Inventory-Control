const initialState = {
    open: false,
    database: [],
    update: {}
}

export const GeneralReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ON_SNACK':
            return { ...state, open: true }

        case 'OFF_SNACK':
            return { ...state, open: false }

        case 'ON_DATABASE':
            if (Array.isArray(action.data)) {
                let currentUp = action.data.find(p => p.update === 'modified')
                return { ...state, database: action.data, update: currentUp }
            }

        default:
            return { ...state }
    }
}