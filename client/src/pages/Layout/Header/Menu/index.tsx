import { FC, useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuProps } from 'antd';
import { HomeOutlined, PlusSquareOutlined, HeartOutlined } from '@ant-design/icons';
import ProfileLabel from './ProfileLabel';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';

interface HeaderMenuProps {
	isVisible: boolean;
	openCreatePostModal: () => void;
}

const mainItems = (navigate: NavigateFunction, createPost: () => void): MenuProps['items'] => [
	{
		key: '/',
		icon: <HomeOutlined style={{ width: '100%', fontSize: '1.25em' }} />,
		onClick: ({ key }) => navigate(key),
	},
	{
		key: '/createpost',
		icon: <PlusSquareOutlined style={{ width: '100%', fontSize: '1.25em' }} />,
		onClick: createPost,
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

const HeaderMenu: FC<HeaderMenuProps> = ({ isVisible, openCreatePostModal }) => {
	const [currentPage, setcurrentPage] = useState('/');
	const location = useLocation();
	const navigate = useNavigate();
	const user = useSelector(getUser);

	const createPost = () => {
		setcurrentPage('/createpost');
		openCreatePostModal();
	};

	useEffect(() => {
		const pathname = '/' + location.pathname.split('/')[1];
		if (!isVisible)
			pathname === '/' + user?.username || pathname === '/account' ? setcurrentPage('/profile') : setcurrentPage(pathname);

		return () => {
			setcurrentPage('/');
		};
	}, [isVisible, location, user]);

	return (
		<Menu
			mode='horizontal'
			style={{ background: 'inherit', border: 'inherit', marginRight: -20 }}
			selectedKeys={[currentPage]}
			items={mainItems(navigate, createPost)}
		/>
	);
};

export default HeaderMenu;
