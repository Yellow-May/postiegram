import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Carousel, Modal, Typography, Image, Button } from 'antd';
import LikePost from 'components/LikePost';
import { usePrivateAxios, useURLQuery } from 'hooks';
import { DataType } from 'pages/ProfilePosts';

interface PostModalProps {
	isUser: boolean;
	username_url: string;
	saved: boolean;
}

const PostModal: FC<PostModalProps> = ({ isUser, username_url, saved }) => {
	const axiosPrivate = usePrivateAxios();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const query = useURLQuery();
	const post_id = query.get('post_id');
	const visible = Boolean(query.get('post_modal'));

	const { data, refetch } = useQuery(
		['post', username_url, post_id, saved],
		async () => {
			const url = saved
				? `/post/bookmarked/${post_id}`
				: `/post/${username_url}/${post_id}`;
			const res = await axiosPrivate.get(url);
			return res.data.post as DataType;
		},
		{ enabled: false }
	);

	const deletePost = useMutation({
		mutationFn: async () => {
			await axiosPrivate.delete(`/post/${data?.id}`);
		},
		onSuccess: () => {
			navigate(-1);
			Modal.destroyAll();
			queryClient.invalidateQueries(['my-posts', username_url]);
		},
	});

	useEffect(() => {
		visible && refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	const confirmModal = () => {
		Modal.confirm({
			title: 'Are you sure you want to delete this Post?',
			centered: true,
			okButtonProps: {
				loading: deletePost.isLoading,
				onClick: () => deletePost.mutate(),
			},
		});
	};

	// handles onClose of the modal
	const onCancel = () => {
		navigate(-1);
		Modal.destroyAll();
	};

	// modal props
	const modalProps = {
		title: <Typography.Title level={4}>{data?.caption}</Typography.Title>,
		visible,
		width: 480,
		centered: true,
		footer:
			!isUser || saved ? null : (
				<Button {...{ danger: true, onClick: confirmModal }}>
					<DeleteFilled />
				</Button>
			),
		destroyOnClose: true,
		onCancel,
	};

	return (
		<Modal {...modalProps}>
			<div>
				<Carousel autoplay dotPosition='bottom'>
					{data?.media.map(({ id, url }) => (
						<div key={id} className='custom-carousel-wrapper'>
							<Image
								crossOrigin='anonymous'
								src={url}
								title={data?.caption}
								height={320}
								preview={false}
							/>
						</div>
					))}
				</Carousel>

				<div style={{ marginTop: 16 }}>
					{data && (
						<LikePost
							{...{ post: data, isUser: saved ? false : isUser, refetch }}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default PostModal;
