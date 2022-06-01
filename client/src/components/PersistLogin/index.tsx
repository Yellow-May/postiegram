import { FC, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRefreshToken } from 'hooks';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';
import { Spin } from 'antd';

interface PersistLoginProps {}

const PersistLogin: FC<PersistLoginProps> = () => {
	const [isLoading, setisLoading] = useState<boolean>(true);
	const user = useSelector(getUser);
	const refresh = useRefreshToken();
	const persist = localStorage.getItem(process.env.REACT_APP_PERSIST as string);

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err);
			} finally {
				setisLoading(false);
			}
		};

		!user && persist ? verifyRefreshToken() : setisLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isLoading ? (
		<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Spin size='large' />
		</div>
	) : (
		<Outlet />
	);
};

export default PersistLogin;
