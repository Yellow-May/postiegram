import { DeleteFilled } from '@ant-design/icons';
import { Carousel, Modal, Typography, Image, Button } from 'antd';
import LikePost from 'components/LikePost';
import { usePrivateAxios, useQuery } from 'hooks';
import { DataType } from 'pages/MyPosts';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PostModalProps {
	isUser: boolean;
	username_url: string;
	fetchData: () => Promise<void>;
}

const PostModal: FC<PostModalProps> = ({ isUser, fetchData, username_url }) => {
	const [post, setPost] = useState<DataType | null>(null);
	const axiosPrivate = usePrivateAxios();
	const navigate = useNavigate();
	const query = useQuery();
	const post_id = query.get('post_id');
	const visible = Boolean(query.get('post_modal'));

	const fetchPost = async () => {
		const res = await axiosPrivate.get(`/post/${username_url}/${post_id}`);
		setPost(res.data.post);
	};

	useEffect(() => {
		visible && fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	const confirmModal = (id: string) => {
		let loading = false;
		Modal.confirm({
			title: 'Are you sure you want to delete this Post?',
			centered: true,
			okButtonProps: {
				loading,
				onClick: async () => {
					loading = true;
					await axiosPrivate.delete(`/post/${id}`);
					loading = false;
					navigate(-1);
					Modal.destroyAll();
					fetchData();
				},
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
		title: <Typography.Title level={4}>{post?.caption}</Typography.Title>,
		visible,
		width: 480,
		centered: true,
		footer: !isUser ? null : (
			<Button
				{...{ danger: true, onClick: () => confirmModal(post?.id as string) }}>
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
					{post?.media.map(({ id, url }) => (
						<div key={id} className='custom-carousel-wrapper'>
							<Image
								crossOrigin='anonymous'
								src={url}
								title={post?.caption}
								height={320}
								preview={false}
							/>
						</div>
					))}
				</Carousel>

				<div style={{ marginTop: 16 }}>
					{post && <LikePost {...{ post, refetchPosts: fetchPost, isUser }} />}
				</div>
			</div>
		</Modal>
	);
};

export default PostModal;
