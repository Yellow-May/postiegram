import { FC, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Image } from 'antd';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';

interface InfoSectionProps {
	isUser: boolean;
}

type UserInfo = {
	id: string;
	username: string;
	profile: {
		full_name: string;
		bio: string;
		profile_pic: {
			_id: string;
			url: string;
			public_id: string;
		};
	};
	posts: number;
	followers: number;
	following: number;
	isFollowing?: { _id: string };
	isFollower: boolean;
};

const InfoSection: FC<InfoSectionProps> = ({ isUser }) => {
	// private axios to handle authorized requests without fails
	const axiosPrivate = usePrivateAxios();

	/**
	 * user state to fetch and display the info of the user through their username
	 * useEffect to make the fetch request on component mounting and cancel request when component is unmounted before the request is completed
	 * also a cleanup to remove the user state to prevent memory leaks
	 */
	const location = useLocation();
	const navigate = useNavigate();
	const [user, setUser] = useState<UserInfo | null>(null);
	useEffect(() => {
		const source = axios.CancelToken.source();
		const username_url = location.pathname.split('/')[1];

		const fetchUser = async () => {
			try {
				const res = await axiosPrivate.get(`/user/${username_url}`, { cancelToken: source.token });
				setUser(res.data?.user);
			} catch (error) {
				console.log(error);
				if (error) navigate('/not-found', { state: location });
			}
		};

		fetchUser();

		return function cleanup() {
			console.log('unmount');
			source.cancel();
			setUser(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isUser]);

	// followloading state to handle the change in the 'Follow', 'Unfollow' or 'Follow Back" button when the request is called
	const [followLoadiing, setfollowLoading] = useState(false);
	const handleFollowRequest = async () => {
		if (user) {
			try {
				setfollowLoading(true);
				const user_id = user.id;
				const _id = user.isFollowing?._id;
				const url = user.isFollowing ? '/user/unfollow' : '/user/follow';
				const data = user.isFollowing ? { _id, user_id } : { user_id };
				await axiosPrivate.post(url, data);
				const res = await axiosPrivate.get(`/user${location.pathname}`);
				setUser(res.data?.user);
			} catch (error) {
				console.log(error);
			} finally {
				setfollowLoading(false);
			}
		}
	};

	const onClickProfilePic = () => {
		console.log('hi');
	};

	return user ? (
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

					{isUser ? (
						<div>
							<Button size='small' style={{ fontWeight: 500 }}>
								<Link to='/account/edits' style={{ color: 'inherit' }}>
									Edit Profile
								</Link>
							</Button>
						</div>
					) : (
						<div>
							<Button size='small' style={{ fontWeight: 500 }} loading={followLoadiing} onClick={handleFollowRequest}>
								{followLoadiing ? '' : user.isFollowing ? 'Unfollow' : user.isFollower ? 'Follow Back' : 'Follow'}
							</Button>
						</div>
					)}
				</div>
				<Space size={40}>
					<Typography.Text style={{ fontSize: '1.1em', cursor: 'default' }}>
						<Typography.Text strong>{user.posts}</Typography.Text>&nbsp;posts
					</Typography.Text>
					<Typography.Text style={{ fontSize: '1.1em' }}>
						<Link to='' style={{ color: 'inherit' }}>
							<Typography.Text strong>{user.followers}</Typography.Text>&nbsp;followers
						</Link>
					</Typography.Text>
					<Typography.Text style={{ fontSize: '1.1em' }}>
						<Link to='' style={{ color: 'inherit' }}>
							<Typography.Text strong>{user.following}</Typography.Text>&nbsp;following
						</Link>
					</Typography.Text>
				</Space>
				<div>
					<Typography.Title level={5} style={{ margin: 0 }}>
						{user?.profile.full_name}
					</Typography.Title>
					<Typography.Text>{user.profile.bio}</Typography.Text>
				</div>
			</Col>
		</Row>
	) : (
		<div style={{ height: 250 }}></div>
	);
};

export default InfoSection;
