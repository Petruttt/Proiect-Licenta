import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    tema: 'light',
};

const temaSlice = createSlice({
    name: 'tema',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.tema = state.tema === 'light' ? 'dark' : 'light';
        }
    }
});

export const {toggleTheme} = temaSlice.actions;
export default temaSlice.reducer;
