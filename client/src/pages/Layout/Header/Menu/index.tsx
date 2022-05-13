import { useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuProps } from 'antd';
import { HomeOutlined, PlusSquareOutlined, HeartOutlined } from '@ant-design/icons';
import ProfileLabel from './ProfileLabel';

const mainItems = (navigate: NavigateFunction): MenuProps['items'] => [
	{
		key: '/',
		icon: <HomeOutlined style={{ width: '100%', fontSize: '1.25em' }} />,
		onClick: ({ key }) => navigate(key),
	},
	{
		key: '/createpost',
		icon: <PlusSquareOutlined style={{ width: '100%', fontSize: '1.25em' }} />,
	},
	{
		key: '/notifcation',
		icon: <HeartOutlined style={{ width: '100%', fontSize: '1.25em' }} />,
	},
	{
		key: '/profile',
		label: <ProfileLabel />,
	},
];

const HeaderMenu = () => {
	const [currentPage, setcurrentPage] = useState('/');
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const pathname = '/' + location.pathname.split('/')[1];
		setcurrentPage(pathname);

		return () => {
			setcurrentPage('/');
		};
	}, [location]);

	return (
		<Menu
			mode='horizontal'
			style={{ background: 'inherit', border: 'inherit', marginRight: -20 }}
			selectedKeys={[currentPage]}
			items={mainItems(navigate)}
		/>
	);
};

export default HeaderMenu;
