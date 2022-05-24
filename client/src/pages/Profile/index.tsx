import { TableOutlined, TagOutlined } from '@ant-design/icons';
import { Divider, Menu, Typography } from 'antd';
import { SavedOutlinedIcon } from 'components';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';
import InfoSection from './InfoSection';

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = () => {
	const user = useSelector(getUser);
	const location = useLocation();
	const isUser = location.pathname.includes(user?.username as string);

	return (
		<div>
			<InfoSection {...{ isUser }} />

			<Divider style={{ marginBottom: 0 }} />

			{isUser && (
				<Menu
					mode='horizontal'
					defaultSelectedKeys={['/']}
					className='custom-menu-nav'
					items={[
						{
							key: '/',
							label: (
								<Typography.Text style={{ fontSize: '0.85em', letterSpacing: 1, margin: '-1px 15px 0 15px' }}>
									<TableOutlined />
									<Link to={`/${user?.username}`} style={{ marginLeft: 8 }}>
										POSTS
									</Link>
								</Typography.Text>
							),
						},
						{
							key: '/saved',
							label: (
								<Typography.Text style={{ fontSize: '0.85em', letterSpacing: 1, margin: '-1px 15px 0 15px' }}>
									<SavedOutlinedIcon />
									<Link to={`/${user?.username}/saved`} style={{ marginLeft: 8 }}>
										SAVED
									</Link>
								</Typography.Text>
							),
						},
						{
							key: '/tagged',
							label: (
								<Typography.Text style={{ fontSize: '0.85em', letterSpacing: 1, margin: '-1px 15px 0 15px' }}>
									<TagOutlined />
									<Link to={`/${user?.username}/tagged`} style={{ marginLeft: 8 }}>
										TAGGED
									</Link>
								</Typography.Text>
							),
							disabled: true,
						},
					]}
					style={{
						justifyContent: 'center',
						background: 'none',
						border: 'none',
						marginBottom: 15,
					}}
				/>
			)}

			<Outlet />
		</div>
	);
};

export default ProfilePage;
