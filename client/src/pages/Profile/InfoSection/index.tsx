import { FC, useState, Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Image } from 'antd';
import { usePrivateAxios } from 'hooks';
import { ChangeProfilePicModal, RelationsModal } from 'components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserType } from 'types';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';

interface InfoSectionProps {
	isUser: boolean;
	userInfo: UserType;
}

const InfoSection: FC<InfoSectionProps> = ({ isUser, userInfo }) => {
	const queryClient = useQueryClient();
	const axiosPrivate = usePrivateAxios();
	const user = useSelector(getUser);
	const { isFollowing, isFollower } = useMemo(() => {
		const isFollowing = userInfo?.followers.find(e => e.user_id === user?._id);
		const isFollower = userInfo?.following.find(e => e.user_id === user?._id);
		return { isFollowing, isFollower };
	}, [userInfo, user]);

	// follow and unfollow mutation
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
			queryClient.invalidateQueries(['user', userInfo?.username]);
		},
	});
	const handleFollowRequest = () => {
		if (userInfo) {
			const user_id = userInfo._id;
			const query = isFollowing ? 'unfollow=true' : 'follow=true';
			const follow_id = isFollowing?._id;
			const data = isFollowing ? { follow_id, user_id } : { user_id };
			mutation.mutate({ query, data });
		}
	};

	/**
	 * relations (followers and following)
	 * state management to handle the modal to display all followers and following respectively
	 */
	const [isOpen, setOpen] = useState({ title: 'followers', visible: false });
	const openModal = (title: string) => setOpen({ title, visible: true });
	const closeModal = () => setOpen({ title: '', visible: false });

	/**
	 * change profile pic
	 * state to handle the modal
	 */
	const [isVisible, setVisible] = useState(false);
	const onClickProfilePic = () => setVisible(true);

	return userInfo ? (
		<Fragment>
			<Row style={{ padding: '5px 0 30px 0' }}>
				<Col
					{...{ xs: 8, sm: 8, md: 8, lg: 8 }}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Image
						crossOrigin='anonymous'
						src={userInfo?.profile.profile_pic.url}
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
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
						<Typography.Title
							level={2}
							style={{ fontWeight: 300, margin: 0, cursor: 'default' }}>
							{userInfo?.username}
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
								<Button
									size='small'
									style={{ fontWeight: 500 }}
									onClick={handleFollowRequest}>
									{isFollowing
										? 'Unfollow'
										: isFollower
										? 'Follow Back'
										: 'Follow'}
								</Button>
							</div>
						)}
					</div>
					<Space size={40}>
						<Typography.Text style={{ fontSize: '1.1em', cursor: 'default' }}>
							<Typography.Text strong>{userInfo?.total_posts}</Typography.Text>
							&nbsp;posts
						</Typography.Text>
						<Typography.Text
							style={{ fontSize: '1.1em', cursor: 'pointer' }}
							onClick={() => openModal('followers')}>
							<Typography.Text strong>
								{userInfo.followers.length}
							</Typography.Text>
							&nbsp;followers
						</Typography.Text>
						<Typography.Text
							style={{ fontSize: '1.1em', cursor: 'pointer' }}
							onClick={() => openModal('following')}>
							<Typography.Text strong>
								{userInfo.following.length}
							</Typography.Text>
							&nbsp;following
						</Typography.Text>
					</Space>
					<div>
						<Typography.Title level={5} style={{ margin: 0 }}>
							{userInfo?.profile.full_name}
						</Typography.Title>
						<Typography.Text>{userInfo.profile.bio}</Typography.Text>
					</div>
				</Col>
			</Row>

			{isOpen.visible && (
				<RelationsModal
					{...{
						...isOpen,
						closeModal,
						isUser,
						userInfo,
					}}
				/>
			)}
			<ChangeProfilePicModal
				{...{
					visible: isVisible,
					close: () => setVisible(false),
					userInfo,
				}}
			/>
		</Fragment>
	) : (
		<div style={{ height: 250 }}></div>
	);
};

export default InfoSection;
