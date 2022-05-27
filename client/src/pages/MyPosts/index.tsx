import { FC, useEffect } from 'react';
import axios from 'axios';
import { usePrivateAxios } from 'hooks';
import { useSelector } from 'react-redux';
import { getIsPostCreated, togglePostCreated } from 'redux/features/Others';
import { useAppDispatch } from 'redux/store';

interface MyPostsProps {}

const MyPosts: FC<MyPostsProps> = () => {
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const fetchData = async () => {
		const res = await axiosPrivate.get('/post/mine', { cancelToken: source.token });
		console.log(res.data);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isPostCreated = useSelector(getIsPostCreated);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (isPostCreated) {
			fetchData();
			dispatch(togglePostCreated(false));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPostCreated]);
	return <div>MyPosts</div>;
};

export default MyPosts;
