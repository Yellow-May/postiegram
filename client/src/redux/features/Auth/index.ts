import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { AuthState, AuthPayloadType, FormLoginValuesProps, FormRegisterValuesProps } from './types';
import axios from 'apis/axios';
import { message } from 'antd';

export const authenticateUser = createAsyncThunk(
	'auth/authenticateUser',
	async (payload: AuthPayloadType, { rejectWithValue }) => {
		const { method, endpoint, data } = payload;
		try {
			const res = await axios[method](`/${endpoint}`, data && { ...data });
			res.data?.message && message.success(res.data?.message);
			return res.data;
		} catch (error: any) {
			if (!error.response) throw error;
			message.error(error.response.data.message);
			return rejectWithValue(error.response.data);
		}
	}
);

const initialState: AuthState = {
	loading: false,
	user: null,
	token: null,
};

export const authSlice = createSlice({
	name: 'Authentication',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(authenticateUser.pending, state => {
			state.loading = true;
		});
		builder.addCase(authenticateUser.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload.user || null;
			state.token = action.payload.token || null;

			!action.payload.user
				? localStorage.removeItem(process.env.REACT_APP_PERSIST as string)
				: localStorage.setItem(process.env.REACT_APP_PERSIST as string, JSON.stringify(true));
		});
		builder.addCase(authenticateUser.rejected, (state, action) => {
			state.loading = false;
			state.user = null;
			state.token = null;
			action?.meta.arg.endpoint === 'refresh' &&
				localStorage.removeItem('XRUEINFODNMS_ymayCLONEig-rueo34');
		});
	},
});

export const LoginUser = (data: FormLoginValuesProps) =>
	authenticateUser({ method: 'post', endpoint: 'login', data });
export const RegisterUser = (data: FormRegisterValuesProps) =>
	authenticateUser({ method: 'post', endpoint: 'register', data });
export const RefreshToken = () => authenticateUser({ method: 'get', endpoint: 'refresh' });
export const LogoutUser = () => authenticateUser({ method: 'patch', endpoint: 'logout' });

export const loadingState = (state: RootState) => state.auth.loading;
export const getUser = (state: RootState) => state.auth.user;
export const getAcToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
