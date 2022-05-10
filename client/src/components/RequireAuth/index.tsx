import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router';
import { getUser } from 'redux/features/Auth';
import { UserRole } from 'redux/features/Auth/types';

interface RequireAuthProps {
	permissions: (UserRole | undefined)[];
}

const RequireAuth: FC<RequireAuthProps> = ({ permissions }) => {
	const user = useSelector(getUser);
	const location = useLocation();

	return permissions.includes(user?.role) ? (
		<Outlet />
	) : user ? (
		<Navigate to='/unathorized' state={{ from: location }} replace />
	) : (
		<Navigate to='/login' state={{ from: location }} replace />
	);
};

export default RequireAuth;
