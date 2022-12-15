import { FC, useMemo } from 'react';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Space, Button, Typography } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { usePrivateAxios } from 'hooks';
import {
	QueryObserverResult,
	RefetchOptions,
	RefetchQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';
import { PostType } from 'types';

interface LikePostProps {
	post: {
		_id: string;
		likes: { _id: string; user_id: string }[];
	};
	queryKey?: string[];
	refetch?: <TPageData>(
		options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
	) => Promise<QueryObserverResult<PostType, unknown>>;
}

let source: CancelTokenSource | null;

const LikePost: FC<LikePostProps> = ({
	post,
	queryKey,
	refetch,
}: LikePostProps) => {
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();
	const user = useSelector(getUser);
	const like_id = useMemo(
		() => user && post.likes.find(like => like.user_id === user._id)?._id,
		[post, user]
	);

	const mutation = useMutation({
		mutationFn: async () => {
			if (source) source.cancel();
			source = axios.CancelToken.source();
			await axiosPrivate.patch(
				`/posts/${post._id}/toggle?like=true`,
				{ like_id },
				{ cancelToken: source.token }
			);
		},
		onSuccess: () => {
			queryKey && queryClient.invalidateQueries(queryKey);
			refetch?.();
		},
	});

	return (
		<Space direction='horizontal' size={5} style={{ flexGrow: 1 }}>
			{
				<Button
					type='link'
					icon={
						like_id ? (
							<HeartFilled style={{ color: '#eb2f96', fontSize: 20 }} />
						) : (
							<HeartOutlined style={{ color: '#eb2f96', fontSize: 20 }} />
						)
					}
					onClick={() => mutation.mutate()}
				/>
			}

			{post.likes[0] && (
				<Typography.Text style={{ maxWidth: 250 }} ellipsis>
					{like_id && post.likes.length > 1
						? `Liked by ${post.likes.length - 1} others`
						: !like_id && post.likes.length > 0
						? `Liked by ${post.likes.length} others`
						: ``}
				</Typography.Text>
			)}
		</Space>
	);
};

export default LikePost;
