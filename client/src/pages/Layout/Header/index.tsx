import { FC, useEffect, useState } from 'react';
import { Avatar, Layout, Menu, Typography, Image, Dropdown, Divider, Modal } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon, {
	HeartOutlined,
	HomeOutlined,
	LogoutOutlined,
	PlusSquareOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getUser, LogoutUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
	const [currentPage, setcurrentPage] = useState('/');
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector(getUser);
	const dispatch = useAppDispatch();
	const logout = () => dispatch(LogoutUser());

	useEffect(() => {
		const pathname = '/' + location.pathname.split('/')[1];
		setcurrentPage(pathname);

		return () => {
			setcurrentPage('/');
		};
	}, [location]);

	return (
		<Layout.Header
			style={{
				backgroundColor: '#f9f9f9',
				borderBottom: 'thin solid #bebebe',
				padding: 0,
			}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					maxWidth: 960,
					margin: 'auto',
					display: 'flex',
					alignItems: 'center',
				}}>
				<div className='logo' style={{ flexGrow: 1 }}>
					<Typography.Title level={2} italic style={{ margin: 0 }}>
						<Link to='/' style={{ color: 'inherit' }}>
							Postiegram
						</Link>
					</Typography.Title>
				</div>
				<Menu
					mode='horizontal'
					style={{ background: 'inherit', border: 'inherit', marginRight: -20 }}
					selectedKeys={[currentPage]}
					items={[
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
							label: (
								<Dropdown
									arrow
									placement='bottomRight'
									trigger={['click']}
									overlay={
										<Menu
											style={{ width: 200, borderRadius: 5, padding: 8 }}
											items={[
												{
													key: `/profile/${user?.username}`,
													icon: <UserOutlined style={{ fontSize: '1.125em', marginRight: 10 }} />,
													label: 'Profile',
													onClick: ({ key }) => navigate(key),
												},
												{
													key: `/profile/${user?.username}/saved`,
													icon: (
														<Icon
															style={{ fontSize: '1.125em', marginRight: 10 }}
															component={() => (
																<svg
																	fill='#000000'
																	xmlns='http://www.w3.org/2000/svg'
																	viewBox='0 0 24 24'
																	width='1em'
																	height='1em'>
																	<path d='M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z' />
																</svg>
															)}
														/>
													),
													label: 'Saved',
													onClick: ({ key }) => navigate(key),
												},
												{
													key: `/profile/account`,
													icon: <SettingOutlined style={{ fontSize: '1.125em', marginRight: 10 }} />,
													label: 'Settings',
													onClick: ({ key }) => navigate(key),
												},
												{
													key: 'divider',
													label: <Divider style={{ margin: '2px 0' }} />,
													disabled: true,
													style: { cursor: 'default' },
												},
												{
													key: 'logout',
													icon: <LogoutOutlined style={{ fontSize: '1.125em', marginRight: 10, color: '#fa3131' }} />,
													label: 'Logout',
													onClick: () =>
														Modal.confirm({
															title: 'Are you sure you want to log out?',
															onOk() {
																logout();
															},
															cancelText: 'Stay',
															okText: 'Log Out',
															okButtonProps: { danger: true },
														}),
												},
											]}
										/>
									}>
									<Avatar
										crossOrigin='use-credentials'
										src={<Image crossOrigin='use-credentials' src={user?.img} alt={user?.username} preview={false} />}
									/>
								</Dropdown>
							),
						},
					]}
				/>
			</div>
		</Layout.Header>
	);
};

export default Header;
