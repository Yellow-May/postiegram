import Icon, { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Divider, Modal, Avatar, Image } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, LogoutUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';

const SavedOutlined = () => (
	<Icon
		style={{ fontSize: '1.125em', marginRight: 10 }}
		component={() => (
			<svg fill='#000000' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='1em' height='1em'>
				<path d='M 6.0097656 2 C 4.9143111 2 4.0097656 2.9025988 4.0097656 3.9980469 L 4 22 L 12 19 L 20 22 L 20 20.556641 L 20 4 C 20 2.9069372 19.093063 2 18 2 L 6.0097656 2 z M 6.0097656 4 L 18 4 L 18 19.113281 L 12 16.863281 L 6.0019531 19.113281 L 6.0097656 4 z' />
			</svg>
		)}
	/>
);

const ProfileLabel: FC = () => {
	const navigate = useNavigate();
	const user = useSelector(getUser);
	const dispatch = useAppDispatch();
	const logout = () => dispatch(LogoutUser());

	return (
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
							icon: <SavedOutlined />,
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
	);
};

export default ProfileLabel;
