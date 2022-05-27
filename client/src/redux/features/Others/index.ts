import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { OthersState } from './types';

const initialState: OthersState = {
	isPostCreated: false,
};

export const othersSlice = createSlice({
	name: 'others',
	initialState,
	reducers: {
		togglePostCreated: (state, action) => {
			state.isPostCreated = action.payload;
		},
	},
});

export const { togglePostCreated } = othersSlice.actions;

export const getIsPostCreated = (state: RootState) => state.others.isPostCreated;

export default othersSlice.reducer;
