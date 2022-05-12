import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.min.css';

// pages and components
import {
	PageLayout,
	HomePage,
	LoginPage,
	RegisterPage,
	ComingSoonPage,
	NotFoundPage,
	UnAuthorizedPage,
} from 'pages';
import { RequireAuth, AlreadyAuth, PersistLogin } from 'components';
import ProfilePage from 'pages/Profile';

// myapp props interface
interface MyAppProps {}

const MyApp: FC<MyAppProps> = () => {
	return (
		<Routes>
			<Route element={<PersistLogin />}>
				{/* Private */}
				<Route element={<RequireAuth permissions={[2001]} />}>
					<Route path='/' element={<PageLayout />}>
						<Route index element={<HomePage />} />
						<Route path='profile'>
							<Route path=':username' element={<ProfilePage />} />
						</Route>
					</Route>
				</Route>

				{/* Public Pages */}
				<Route element={<AlreadyAuth />}>
					<Route path='login' element={<LoginPage />} />
					<Route path='register' element={<RegisterPage />} />
				</Route>
			</Route>
			<Route path='unauthorized' element={<UnAuthorizedPage />} />
			<Route path='coming-soon' element={<ComingSoonPage />} />
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	);
};

export default MyApp;
