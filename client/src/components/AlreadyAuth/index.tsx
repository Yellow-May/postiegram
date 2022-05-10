import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';

interface AlreadyAuthProps {}

const AlreadyAuth: FC<AlreadyAuthProps> = () => {
	const user = useSelector(getUser);

	return user ? <Navigate to='/' /> : <Outlet />;
};

export default AlreadyAuth;
