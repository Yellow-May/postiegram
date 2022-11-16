import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Space, Button, Typography } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { usePrivateAxios } from 'hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LikePostProps {
	post: {
		id: string;
		likes: { username: string; profile_pic: string }[];
		like_id?: string;
	};
	isUser?: boolean;
}

let source: CancelTokenSource | null;

const LikePost: FC<LikePostProps> = ({ post, isUser }: LikePostProps) => {
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			if (source) source.cancel();
			source = axios.CancelToken.source();
			return await axiosPrivate.patch(
				`/post/${post.id}/like`,
				{
					like_id: post.like_id || null,
				},
				{ cancelToken: source.token }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});

	return (
		<Space direction='horizontal' size={5} style={{ flexGrow: 1 }}>
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
					onClick={() => mutation.mutate()}
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
