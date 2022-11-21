import { FC, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Carousel, Modal, Typography, Image, Button } from 'antd';
import { LikePost, BookmarkPost } from 'components';
import { usePrivateAxios, useURLQuery } from 'hooks';
import { PostType } from 'types';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';

interface PostModalProps {
	queryKey: (string | object)[];
}

const PostModal: FC<PostModalProps> = ({ queryKey }) => {
	const axiosPrivate = usePrivateAxios();
	const navigate = useNavigate();
	const user = useSelector(getUser);
	const queryClient = useQueryClient();
	const URLQuery = useURLQuery();
	const post_id = URLQuery.get('post_id');
	const visible = Boolean(URLQuery.get('post_modal'));

	const { data, refetch } = useQuery(
		['post', post_id],
		async () => {
			const res = await axiosPrivate.get(`/posts/${post_id}`);
			return res.data as PostType;
		},
		{ enabled: false }
	);

	const deletePost = useMutation({
		mutationFn: async () => {
			await axiosPrivate.delete(`/post/${data?._id}`);
		},
		onSuccess: () => {
			navigate(-1);
			Modal.destroyAll();
			queryClient.invalidateQueries(queryKey);
		},
	});

	useEffect(() => {
		visible && refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [URLQuery]);

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
			user?.id === data?.creator_id ? (
				<Button {...{ danger: true, onClick: confirmModal }}>
					<DeleteFilled />
				</Button>
			) : null,
		destroyOnClose: true,
		onCancel,
	};

	return (
		<Modal {...modalProps}>
			<div>
				<Carousel autoplay dotPosition='bottom'>
					{data?.media.map(({ _id, url }) => (
						<div key={_id} className='custom-carousel-wrapper'>
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

				<div
					style={{
						marginTop: 16,
						display: 'flex',
						alignItems: 'center',
					}}>
					{data && (
						<Fragment>
							<LikePost {...{ post: data, refetch }} />
							{user?.id !== data.creator_id && (
								<BookmarkPost
									{...{
										post: data,
										queryKey,
										refetch,
									}}
								/>
							)}
						</Fragment>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default PostModal;
