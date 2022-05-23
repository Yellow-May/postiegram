import { TableOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Image, Menu, Row, Space, Typography } from 'antd';
import { SavedOutlinedIcon } from 'components';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';

interface ProfilePageProps {}

const ProfilePage: FC<ProfilePageProps> = () => {
	const user = useSelector(getUser);

	const onClickProfilePic = () => {
		console.log('hi');
	};

	return (
		<div>
			<Row style={{ padding: '5px 0 30px 0' }}>
				<Col {...{ xs: 8, sm: 8, md: 8, lg: 8 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Image
						crossOrigin='anonymous'
						src={user?.profile.profile_pic.url}
						width={150}
						height={150}
						preview={false}
						title='change profile picture'
						style={{ borderRadius: '50%', cursor: 'pointer' }}
						onClick={onClickProfilePic}
					/>
				</Col>
				<Col
					{...{ xs: 16, sm: 16, md: 16, lg: 16 }}
					style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
						<Typography.Title level={2} style={{ fontWeight: 300, margin: 0, cursor: 'default' }}>
							{user?.username}
						</Typography.Title>

						<Button size='small' style={{ fontWeight: 500 }}>
							<Link to='/account/edits' style={{ color: 'inherit' }}>
								Edit Profile
							</Link>
						</Button>
					</div>
					<Space size={40}>
						<Typography.Text style={{ fontSize: '1.1em', cursor: 'default' }}>
							<Typography.Text strong>{0}</Typography.Text>&nbsp;posts
						</Typography.Text>
						<Typography.Text style={{ fontSize: '1.1em' }}>
							<Link to='' style={{ color: 'inherit' }}>
								<Typography.Text strong>{200}</Typography.Text>&nbsp;followers
							</Link>
						</Typography.Text>
						<Typography.Text style={{ fontSize: '1.1em' }}>
							<Link to='' style={{ color: 'inherit' }}>
								<Typography.Text strong>{300}</Typography.Text>&nbsp;following
							</Link>
						</Typography.Text>
					</Space>
					<div>
						<Typography.Title level={5} style={{ margin: 0 }}>
							{user?.profile.full_name}
						</Typography.Title>
						<Typography.Text>{user?.profile.bio}</Typography.Text>
					</div>
				</Col>
			</Row>

			<Divider style={{ marginBottom: 0 }} />

			<Menu
				mode='horizontal'
				defaultSelectedKeys={['/']}
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

			<Outlet />
		</div>
	);
};

export default ProfilePage;
