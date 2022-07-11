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
	refresh: () => Promise<void>;
	isUser?: boolean;
}

let source: CancelTokenSource | null;

const LikePost: FC<LikePostProps> = ({ post, refresh, isUser }) => {
	const axiosPrivate = usePrivateAxios();

	const likeRequest = async () => {
		if (source) source.cancel('Operation canceled due to new request.');
		source = axios.CancelToken.source();
		await axiosPrivate.post(
			'/post/like',
			{
				post_id: post.id,
				like_id: post.like_id || null,
			},
			{ cancelToken: source.token }
		);
		refresh();
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
					onClick={likeRequest}
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
