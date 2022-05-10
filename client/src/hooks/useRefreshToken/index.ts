import { useAppDispatch } from 'redux/store';
import { RefreshToken } from 'redux/features/Auth';

const useRefreshToken = () => {
	const dispatch = useAppDispatch();

	const refresh = async () => {
		const res: { error?: any; payload: any } = await dispatch(RefreshToken());
		return res.payload.token;
	};

	return refresh;
};

export default useRefreshToken;
