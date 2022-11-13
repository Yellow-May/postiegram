import {
	UserOutlined,
	SettingOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Divider, Modal, Avatar, Image } from 'antd';
import { BookmarkOutlinedIcon } from 'components/Icons';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, LogoutUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';

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
							key: `/${user?.username}`,
							icon: (
								<UserOutlined
									style={{ fontSize: '1.125em', marginRight: 10 }}
								/>
							),
							label: 'Profile',
							onClick: ({ key }) => navigate(key),
						},
						{
							key: `/${user?.username}/saved`,
							icon: (
								<BookmarkOutlinedIcon
									style={{ fontSize: '1.125em', marginRight: 10 }}
								/>
							),
							label: 'Saved',
							onClick: ({ key }) => navigate(key),
						},
						{
							key: `/account/edits`,
							icon: (
								<SettingOutlined
									style={{ fontSize: '1.125em', marginRight: 10 }}
								/>
							),
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
							icon: (
								<LogoutOutlined
									style={{
										fontSize: '1.125em',
										marginRight: 10,
										color: '#fa3131',
									}}
								/>
							),
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
				src={
					<Image
						crossOrigin='anonymous'
						src={user?.profile.profile_pic.url}
						alt={user?.username}
						preview={false}
					/>
				}
			/>
		</Dropdown>
	);
};

export default ProfileLabel;
