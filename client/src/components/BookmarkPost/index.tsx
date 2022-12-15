import {
	QueryObserverResult,
	RefetchOptions,
	RefetchQueryFilters,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { Button } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import { BookmarkFilledIcon, BookmarkOutlinedIcon } from 'components/Icons';
import { usePrivateAxios } from 'hooks';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';
import { PostType } from 'types';

interface BookmarkPostInterface {
	post: {
		_id: string;
		bookmarks: { _id: string; user_id: string }[];
	};
	queryKey?: (string | object)[];
	refetch?: <TPageData>(
		options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
	) => Promise<QueryObserverResult<PostType, unknown>>;
}

let source: CancelTokenSource | null;

const BookmarkPost = ({ post, queryKey, refetch }: BookmarkPostInterface) => {
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();
	const user = useSelector(getUser);
	const bookmark_id = useMemo(
		() =>
			user &&
			post.bookmarks.find(bookmark => bookmark.user_id === user._id)?._id,
		[post, user]
	);

	const mutation = useMutation({
		mutationFn: async () => {
			if (source) source.cancel();
			source = axios.CancelToken.source();
			return axiosPrivate.patch(
				`/posts/${post._id}/toggle?bookmark=true`,
				{ bookmark_id },
				{ cancelToken: source.token }
			);
		},
		onSuccess: () => {
			queryKey && queryClient.invalidateQueries(queryKey);
			refetch?.();
		},
	});

	return (
		<Button
			icon={bookmark_id ? <BookmarkFilledIcon /> : <BookmarkOutlinedIcon />}
			onClick={() => mutation.mutate()}
		/>
	);
};

export default BookmarkPost;
