import { FC, Fragment, useEffect, useState } from 'react';
import { Avatar, Badge, Button, List, Modal, Skeleton } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';

interface RelationsModalProps {
	isUser: boolean;
	title: string;
	visible: boolean;
	closeModal: () => void;
	followRequest: ({
		url,
		data,
	}: {
		url: string;
		data: {
			_id?: string;
			user_id: string;
		};
	}) => Promise<void>;
}

type RelationsInfo = {
	full_name: string;
	profile_pic: string;
	user_id: string;
	username: string;
	id?: string;
	loading: boolean;
	isFollowing?: { _id: string };
	isFollower?: boolean;
};

const RelationsModal: FC<RelationsModalProps> = ({ isUser, title, visible, closeModal, followRequest }) => {
	/**
	 * state management
	 * initLoading for the inital loading on mount
	 * data for the response data
	 * axiosPrivate for private requests, source to handle request CancelToken to stop request in certain situations like unmount
	 */
	const [initLoading, setInitLoading] = useState(true);
	const [data, setData] = useState<RelationsInfo[]>([]);
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const navigate = useNavigate();
	const location = useLocation();
	const username_url = location.pathname.split('/')[1];

	// fetch request for followers or following
	const fetchData = async () => {
		const res = await axiosPrivate(`/user/${username_url}/${title.toLowerCase()}`, {
			cancelToken: source.token,
		});
		const data = res.data?.followers || res.data?.following;
		setData(data);
	};

	// on mount
	useEffect(() => {
		fetchData();
		setInitLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// followloading state to handle the change in the 'Follow', 'Unfollow' or 'Follow Back" button when the request is called
	const [followLoading, setfollowLoading] = useState(false);
	const handleFollowRequest = async (user: RelationsInfo) => {
		setfollowLoading(true);
		const user_id = user.user_id;
		const _id = user.isFollowing?._id || user.id;
		const url = user.isFollowing || title === 'Following' ? '/user/unfollow' : '/user/follow';
		const data = _id ? { _id, user_id } : { user_id };
		await followRequest({ url, data });
		await fetchData();
		setfollowLoading(false);
	};

	// action button logic, either 'Follow', 'Unfollow' or 'Follow Back'
	const action = (item: RelationsInfo) => {
		if (isUser) {
			return (
				<Button loading={followLoading} onClick={() => handleFollowRequest(item)}>
					{title === 'Followers' && !item.isFollowing ? 'Follow Back' : 'Unfollow'}
				</Button>
			);
		}
		return (
			<Button
				type='link'
				onClick={() => {
					closeModal();
					navigate(`/${item.username}`);
				}}>
				View Profile
			</Button>
		);
	};

	// handles onClose of the modal
	const onCancel = () => {
		source.cancel();
		setData([]);
		setInitLoading(true);
		closeModal();
	};

	// modal props
	const modalProps = {
		title,
		visible,
		width: 480,
		centered: true,
		footer: null,
		destroyOnClose: true,
		onCancel,
	};

	return (
		<Modal forceRender {...modalProps}>
			<List
				style={{ maxHeight: 360, overflow: 'auto' }}
				loading={initLoading}
				itemLayout='horizontal'
				dataSource={data}
				renderItem={item => (
					<List.Item actions={[action(item)]}>
						<Skeleton avatar title={false} loading={item.loading} active>
							<List.Item.Meta
								avatar={<Avatar crossOrigin='anonymous' src={item.profile_pic} />}
								title={
									<Fragment>
										<Link to={`/${item.username}`} onClick={onCancel}>
											{item.username}
										</Link>
										{title === 'Following' && item.isFollower && (
											<Badge count={'follows you'} style={{ top: -10, background: '#708ffd', fontSize: '0.6em' }} />
										)}
										{title === 'Followers' && item.isFollowing && (
											<Badge count={'following'} style={{ top: -10, background: '#708ffd', fontSize: '0.6em' }} />
										)}
									</Fragment>
								}
								description={item.full_name}
							/>
						</Skeleton>
					</List.Item>
				)}
			/>
		</Modal>
	);
};

export default RelationsModal;
