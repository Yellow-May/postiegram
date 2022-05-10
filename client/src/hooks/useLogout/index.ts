import { LogoutUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';

const useLogout = () => {
	const dispatch = useAppDispatch();
	const logout = () => dispatch(LogoutUser());

	return logout;
};

export default useLogout;
