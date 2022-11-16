import { FC, Fragment, useRef } from 'react';
import { Avatar, Badge, Button, List, Modal, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface RelationsModalProps {
	isUser: boolean;
	title: string;
	visible: boolean;
	closeModal: () => void;
	username_url: string;
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

const RelationsModal: FC<RelationsModalProps> = ({
	isUser,
	title,
	visible,
	closeModal,
	username_url,
}) => {
	/**
	 * state management
	 * initLoading for the inital loading on mount
	 * data for the response data
	 * axiosPrivate for private requests, source to handle request CancelToken to stop request in certain situations like unmount
	 */
	const changeRef = useRef(false);
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { isLoading, data } = useQuery(
		['relationship', username_url, title],
		async () => {
			const res = await axiosPrivate(`/user/${username_url}/${title}`, {
				cancelToken: source.token,
			});
			return (res.data?.followers || res.data?.following) as RelationsInfo[];
		}
	);

	const mutation = useMutation({
		mutationFn: async ({
			url,
			data,
		}: {
			url: string;
			data: { _id?: string; user_id: string };
		}) => {
			return await axiosPrivate.patch(url, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['relationship', username_url, title]);
			changeRef.current = true;
		},
	});
	const handleFollowRequest = async (user: RelationsInfo) => {
		const user_id = user.user_id;
		const _id = user.isFollowing?._id || user.id;
		const url =
			user.isFollowing || title === 'following'
				? '/user/unfollow'
				: '/user/follow';
		const data = _id ? { _id, user_id } : { user_id };
		mutation.mutate({ url, data });
	};

	// action button logic, either 'Follow', 'Unfollow' or 'Follow Back'
	const action = (item: RelationsInfo) => {
		if (isUser) {
			return (
				<Button onClick={() => handleFollowRequest(item)}>
					{title === 'Followers' && !item.isFollowing
						? 'Follow Back'
						: 'Unfollow'}
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
		closeModal();
		if (changeRef.current === true)
			queryClient.invalidateQueries(['user', username_url]);
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
				loading={isLoading}
				itemLayout='horizontal'
				dataSource={data}
				renderItem={item => (
					<List.Item actions={[action(item)]}>
						<Skeleton avatar title={false} loading={item.loading} active>
							<List.Item.Meta
								avatar={
									<Avatar crossOrigin='anonymous' src={item.profile_pic} />
								}
								title={
									<Fragment>
										<Link to={`/${item.username}`} onClick={onCancel}>
											{item.username}
										</Link>
										{title === 'Following' && item.isFollower && (
											<Badge
												count={'follows you'}
												style={{
													top: -10,
													background: '#708ffd',
													fontSize: '0.6em',
												}}
											/>
										)}
										{title === 'Followers' && item.isFollowing && (
											<Badge
												count={'following'}
												style={{
													top: -10,
													background: '#708ffd',
													fontSize: '0.6em',
												}}
											/>
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
