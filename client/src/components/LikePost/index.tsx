import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Space, Button, Typography } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { usePrivateAxios } from 'hooks';

interface LikePostProps {
	post: {
		id: string;
		likes: { username: string; profile_pic: string }[];
		like_id?: string;
	};
	refetchPosts: any;
	isUser?: boolean;
}

let source: CancelTokenSource | null;

const LikePost: FC<LikePostProps> = ({
	post,
	refetchPosts,
	isUser,
}: LikePostProps) => {
	const axiosPrivate = usePrivateAxios();

	const likePost = async () => {
		if (source) source.cancel();
		source = axios.CancelToken.source();
		const res = await axiosPrivate.post(
			'/post/like',
			{
				post_id: post.id,
				like_id: post.like_id || null,
			},
			{ cancelToken: source.token }
		);
		res.status === 200 && refetchPosts();
	};

	return (
		<Space direction='horizontal' size={5}>
			{!isUser && (
				<Button
					type='link'
					icon={
						post.like_id ? (
							<HeartFilled style={{ color: '#eb2f96', fontSize: 20 }} />
						) : (
							<HeartOutlined style={{ color: '#eb2f96', fontSize: 20 }} />
						)
					}
					onClick={() => likePost()}
				/>
			)}

			{post.likes[0] && (
				<Typography.Text style={{ maxWidth: 250 }} ellipsis>
					{post.likes.length > 1
						? `Liked by ${post.likes[0].username} and ${
								post.likes.length - 1
						  } other`
						: `Liked by ${post.likes[0].username}`}
				</Typography.Text>
			)}
		</Space>
	);
};

export default LikePost;
