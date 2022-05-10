import { FC } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Layout, Space, Image, Button, Popconfirm, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { getUser, LogoutUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';
import { Link } from 'react-router-dom';

interface SiderProps {}

const Sider: FC<SiderProps> = () => {
	const user = useSelector(getUser);
	const dispatch = useAppDispatch();
	const logout = () => dispatch(LogoutUser());

	return (
		<Layout.Sider style={{ backgroundColor: '#e3e3e3', padding: '24px 0 0 24px' }}>
			<div style={{ marginBottom: 16 }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Space style={{ flexGrow: 1 }}>
						<Avatar
							crossOrigin='use-credentials'
							src={
								<Link to='/profile'>
									<Image crossOrigin='use-credentials' src={user?.img} preview={false} />
								</Link>
							}
							style={{ width: 60, height: 60, border: 'thin solid #9e9e9e' }}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'start',
							}}>
							<Typography.Text title='username' strong style={{ fontSize: '0.95em' }}>
								<Link to='/profile' style={{ color: 'inherit' }}>
									{user?.username}
								</Link>
							</Typography.Text>
							<Typography.Text ellipsis style={{ fontSize: '0.95em' }}>
								{user?.email}
							</Typography.Text>
						</div>
					</Space>
					<Popconfirm
						title='Are you sure you want to logout?'
						onConfirm={logout}
						okText='Logout'
						cancelText='Continue Exploring'>
						<Button title='logout' danger icon={<LogoutOutlined />} />
					</Popconfirm>
				</div>
			</div>
			<Layout.Footer
				style={{
					textAlign: 'center',
					width: '100%',
					background: 'none',
					color: 'gray',
					padding: '24px 0',
				}}>
				<Typography.Text type='secondary'>
					Designed and Developed by&nbsp;
					<Typography.Link href='https://github.com/Yellow-May' target='_blank' rel='noreferrer'>
						Yellow May
					</Typography.Link>
				</Typography.Text>
			</Layout.Footer>
		</Layout.Sider>
	);
};

export default Sider;
