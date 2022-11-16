import { Avatar, Layout, Space, Image, Typography, List, Divider } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'redux/features/Auth';
import { usePrivateAxios } from 'hooks';
import ListItem from './ListItem';

export type BotUserType = {
	id: string;
	username: string;
	profile: {
		full_name: string;
		profile_pic: {
			url: string;
		};
	};
	isFollowing: boolean;
};

const Sider = () => {
	const user = useSelector(getUser);
	const axiosPrivate = usePrivateAxios();

	const { data: botsData } = useQuery(['bot-users'], async () => {
		const res = await axiosPrivate('/user/bots');
		return res.data.users as BotUserType[];
	});

	return (
		<Layout.Sider
			style={{ backgroundColor: '#e3e3e3', padding: '24px 0 0 24px' }}>
			<div style={{ marginBottom: 16 }}>
				<div
					style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}>
					<Space style={{ flexGrow: 1 }}>
						<Avatar
							src={
								<Link to={`/${user?.username}`}>
									<Image
										crossOrigin='anonymous'
										src={user?.profile.profile_pic.url}
										preview={false}
									/>
								</Link>
							}
							style={{ width: 60, height: 60, border: 'thin solid #9e9e9e' }}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'start',
								gap: 3,
							}}>
							<Typography.Text
								title={user?.username}
								strong
								style={{ fontSize: '1.125em' }}>
								<Link to={`/${user?.username}`} style={{ color: 'inherit' }}>
									{user?.username}
								</Link>
							</Typography.Text>
							<Typography.Text ellipsis style={{ fontSize: '0.95em' }}>
								{user?.profile.full_name}
							</Typography.Text>
						</div>
					</Space>
				</div>

				<Divider orientation='left'>Bots Suggestions</Divider>

				<List
					itemLayout='horizontal'
					size='small'
					dataSource={botsData?.slice(0, 4)}
					renderItem={bot => <ListItem {...{ bot }} />}
				/>
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
					<Typography.Link
						href='https://github.com/Yellow-May'
						target='_blank'
						rel='noreferrer'>
						Yellow May
					</Typography.Link>
				</Typography.Text>
			</Layout.Footer>
		</Layout.Sider>
	);
};

export default Sider;
