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
	MyPosts,
	SavedPosts,
	ProfilePage,
	AccountManagementPage,
} from 'pages';
import { RequireAuth, AlreadyAuth, PersistLogin } from 'components';

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
						<Route path=':username' element={<ProfilePage />}>
							<Route index element={<MyPosts />} />
							<Route path='saved' element={<SavedPosts />} />
						</Route>
						<Route path='account/edits' element={<AccountManagementPage />} />
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
			<Route path='not-found' element={<NotFoundPage />} />
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	);
};

export default MyApp;
