import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { BookmarkFilledIcon, BookmarkOutlinedIcon } from 'components/Icons';
import { usePrivateAxios } from 'hooks';

interface BookmarkPostInterface {
	post: {
		id: string;
		bookmark_id?: string;
	};
	isUser?: boolean;
}

let source: CancelTokenSource | null;

const BookmarkPost = ({ post }: BookmarkPostInterface) => {
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			if (source) source.cancel();
			source = axios.CancelToken.source();
			return axiosPrivate.patch(
				`/post/${post.id}/bookmark`,
				{
					bookmark_id: post?.bookmark_id,
				},
				{ cancelToken: source.token }
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
		},
	});

	return (
		<Button
			icon={
				post.bookmark_id ? <BookmarkFilledIcon /> : <BookmarkOutlinedIcon />
			}
			onClick={() => mutation.mutate()}
		/>
	);
};

export default BookmarkPost;
