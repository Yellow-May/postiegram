import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.min.css';

// pages
import { ComingSoonPage, HomePage, LoginPage, RegisterPage, NotFoundPage, UnAuthorizedPage } from 'pages';

interface MyAppProps {}

const MyApp: FC<MyAppProps> = () => {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='login' element={<LoginPage />} />
			<Route path='register' element={<RegisterPage />} />
			<Route path='unauthorized' element={<UnAuthorizedPage />} />
			<Route path='coming-soon' element={<ComingSoonPage />} />
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	);
};

export default MyApp;
