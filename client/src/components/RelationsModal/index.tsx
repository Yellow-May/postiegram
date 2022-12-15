import { FC, Fragment, useCallback, useRef } from 'react';
import { Avatar, Badge, Button, List, Modal, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserType } from 'types';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';

interface RelationsModalProps {
	isUser: boolean;
	title: string;
	visible: boolean;
	closeModal: () => void;
	userInfo: UserType;
}

const RelationsModal: FC<RelationsModalProps> = ({
	isUser,
	title,
	visible,
	closeModal,
	userInfo,
}) => {
	const changeRef = useRef(false);
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const navigate = useNavigate();
	const user = useSelector(getUser);
	const queryClient = useQueryClient();
	const queryKey = ['users', { user_id: userInfo._id, relationship: title }];

	const follow_type = useCallback(
		(specificUser: UserType) => {
			const isFollowing = specificUser?.followers.find(
				e => e.user_id === user?._id
			);
			const isFollower = specificUser?.following.find(
				e => e.user_id === user?._id
			);
			return { isFollowing, isFollower };
		},
		[user]
	);

	const { isLoading, isFetching, data } = useQuery(queryKey, async () => {
		const res = await axiosPrivate(
			`/users?user_id=${userInfo._id}&${title}=true`,
			{
				cancelToken: source.token,
			}
		);
		return res.data?.users as UserType[];
	});

	const mutation = useMutation({
		mutationFn: async ({
			query,
			data,
		}: {
			query: string;
			data: { follow_id?: string; user_id: string };
		}) => {
			return await axiosPrivate.patch(`users/toggle-follow?${query}`, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(queryKey);
			changeRef.current = true;
		},
	});
	const handleFollowRequest = async (user: UserType) => {
		const { isFollowing } = follow_type(user);
		const user_id = user._id;
		const query = isFollowing ? 'unfollow=true' : 'follow=true';
		const follow_id = isFollowing?._id;
		const data = isFollowing ? { follow_id, user_id } : { user_id };
		mutation.mutate({ query, data });
	};

	// action button logic, either 'Follow', 'Unfollow' or 'Follow Back'
	const action = (item: UserType) => {
		if (isUser) {
			return (
				<Button onClick={() => handleFollowRequest(item)}>
					{title === 'Followers' && !follow_type(item).isFollowing
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
			queryClient.invalidateQueries(['user', userInfo.username]);
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
						<Skeleton avatar title={false} loading={isFetching} active>
							<List.Item.Meta
								avatar={
									<Avatar
										crossOrigin='anonymous'
										src={item.profile.profile_pic.url}
									/>
								}
								title={
									<Fragment>
										<Link to={`/${item.username}`} onClick={onCancel}>
											{item.username}
										</Link>
										{title === 'Following' && follow_type(item).isFollower && (
											<Badge
												count={'follows you'}
												style={{
													top: -10,
													background: '#708ffd',
													fontSize: '0.6em',
												}}
											/>
										)}
										{title === 'Followers' && follow_type(item).isFollowing && (
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
								description={item.profile.full_name}
							/>
						</Skeleton>
					</List.Item>
				)}
			/>
		</Modal>
	);
};

export default RelationsModal;
