import { TableOutlined, TagOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Divider, Menu, Typography } from 'antd';
import axios from 'axios';
import { BookmarkOutlinedIcon } from 'components/Icons';
import { usePrivateAxios } from 'hooks';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';
import { UserType } from 'types';
import InfoSection from './InfoSection';

const auth_user_menu = (user: UserType) => [
	{
		key: `/${user.username}`,
		label: (
			<Typography.Text
				style={{
					fontSize: '0.85em',
					letterSpacing: 1,
					margin: '-1px 15px 0 15px',
				}}>
				<TableOutlined />
				<Link to={`/${user.username}`} style={{ marginLeft: 8 }}>
					POSTS
				</Link>
			</Typography.Text>
		),
	},
	{
		key: `/${user.username}/saved`,
		label: (
			<Typography.Text
				style={{
					fontSize: '0.85em',
					letterSpacing: 1,
					margin: '-1px 15px 0 15px',
				}}>
				<BookmarkOutlinedIcon />
				<Link to={`/${user.username}/saved`} style={{ marginLeft: 8 }}>
					SAVED
				</Link>
			</Typography.Text>
		),
	},
	{
		key: `/${user.username}/tagged`,
		label: (
			<Typography.Text
				style={{
					fontSize: '0.85em',
					letterSpacing: 1,
					margin: '-1px 15px 0 15px',
				}}>
				<TagOutlined />
				<Link to={`/${user.username}/tagged`} style={{ marginLeft: 8 }}>
					TAGGED
				</Link>
			</Typography.Text>
		),
		disabled: true,
	},
];

const other_user_menu = (username_url: string) => [
	{
		key: `/${username_url}`,
		label: (
			<Typography.Text
				style={{
					fontSize: '0.85em',
					letterSpacing: 1,
					margin: '-1px 15px 0 15px',
				}}>
				<TableOutlined />
				<Typography.Text style={{ marginLeft: 8 }}>POSTS</Typography.Text>
			</Typography.Text>
		),
	},
];

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = () => {
	const user = useSelector(getUser);
	const location = useLocation();
	const isUser = location.pathname.includes(user?.username as string);
	const username_url = location.pathname.split('/')[1];

	// private axios to handle authorized requests without fails
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();

	const { data: userInfo } = useQuery(['user', username_url], async () => {
		const res = await axiosPrivate.get(`/users/${username_url}`, {
			cancelToken: source.token,
		});
		return res.data;
	});

	return (
		<div>
			<InfoSection {...{ isUser, userInfo }} />

			<Divider style={{ marginBottom: 0 }} />

			<Menu
				mode='horizontal'
				defaultSelectedKeys={[location.pathname]}
				className='custom-menu-nav'
				items={
					user && isUser ? auth_user_menu(user) : other_user_menu(username_url)
				}
				style={{
					justifyContent: 'center',
					background: 'none',
					border: 'none',
					marginBottom: 15,
				}}
			/>

			<Outlet />
		</div>
	);
};

export default ProfilePage;
