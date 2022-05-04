import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.min.css';

// pages
import { HomePage, LoginPage } from 'pages';

interface MyAppProps {}

const MyApp: FC<MyAppProps> = () => {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='login' element={<LoginPage />} />
		</Routes>
	);
};

export default MyApp;
