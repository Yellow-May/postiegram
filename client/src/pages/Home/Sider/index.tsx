import { FC, useEffect, useState } from 'react';
import { Avatar, Layout, Space, Image, Typography, List, Divider, Button } from 'antd';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';
import { Link } from 'react-router-dom';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';

interface SiderProps {
	fetchData: () => Promise<void>;
}

type BotUserType = {
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

const Sider: FC<SiderProps> = ({ fetchData }) => {
	const user = useSelector(getUser);
	const [botUsers, setbotUsers] = useState<BotUserType[]>([]);
	const source = axios.CancelToken.source();

	const axiosPrivate = usePrivateAxios();
	const fetchBots = async () => {
		const res = await axiosPrivate('/user/bots', { cancelToken: source.token });
		setbotUsers(res.data.users);
	};
	useEffect(() => {
		fetchBots();

		return () => {
			source.cancel();
			setbotUsers([]);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFollowRequest = async (user_id: string) => {
		await axiosPrivate.post('/user/follow', { user_id }, { cancelToken: source.token });
		await fetchBots();
		await fetchData();
	};

	return (
		<Layout.Sider style={{ backgroundColor: '#e3e3e3', padding: '24px 0 0 24px' }}>
			<div style={{ marginBottom: 16 }}>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}>
					<Space style={{ flexGrow: 1 }}>
						<Avatar
							src={
								<Link to={`/${user?.username}`}>
									<Image crossOrigin='anonymous' src={user?.profile.profile_pic.url} preview={false} />
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
							<Typography.Text title={user?.username} strong style={{ fontSize: '1.125em' }}>
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
					dataSource={botUsers.slice(0, 4)}
					renderItem={bot => (
						<List.Item
							actions={[
								<Button type='primary' size='small' onClick={() => handleFollowRequest(bot.id)}>
									follow
								</Button>,
							]}>
							<List.Item.Meta
								avatar={<Avatar crossOrigin='anonymous' src={bot.profile.profile_pic.url} />}
								title={<Link to={`/${bot.username}`}>{bot.username}</Link>}
								description={bot.profile.full_name}
							/>
						</List.Item>
					)}
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
					<Typography.Link href='https://github.com/Yellow-May' target='_blank' rel='noreferrer'>
						Yellow May
					</Typography.Link>
				</Typography.Text>
			</Layout.Footer>
		</Layout.Sider>
	);
};

export default Sider;
