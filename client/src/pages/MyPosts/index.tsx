import { FC, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { usePrivateAxios } from 'hooks';
import { useSelector } from 'react-redux';
import { getIsPostCreated, togglePostCreated } from 'redux/features/Others';
import { useAppDispatch } from 'redux/store';
import { Col, Row, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';
import { PostModal } from 'components';

interface MyPostsProps {}

type MediaType = {
	id: string;
	url: string;
};

export type DataType = {
	id: string;
	caption: string;
	created_at: string;
	media: MediaType[];
	likes: { username: string; profile_pic: string }[];
	like_id?: string;
};

const MyPosts: FC<MyPostsProps> = () => {
	const [data, setData] = useState<DataType[]>([]);
	const location = useLocation();
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const username_url = location.pathname.split('/')[1];
	const fetchData = async () => {
		const res = await axiosPrivate.get(`/post/${username_url}`, { cancelToken: source.token });
		setData(res.data.posts);
	};
	useEffect(() => {
		fetchData();

		return function cleanup() {
			source.cancel();
			setData([]);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	const isPostCreated = useSelector(getIsPostCreated);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (isPostCreated) {
			fetchData();
			dispatch(togglePostCreated(false));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPostCreated]);

	const user = useSelector(getUser);
	const isUser = location.pathname.includes(user?.username as string);
	const navigate = useNavigate();

	return (
		<Fragment>
			<Row gutter={28}>
				{data.map(post => {
					const { caption, id, media } = post;
					const { url } = media[0];

					return (
						<Col key={id} {...{ xs: 8, sm: 8, md: 8, lg: 8 }}>
							<div className='custom-img-wrapper' style={{ height: 320 }}>
								<Image
									crossOrigin='anonymous'
									src={url}
									alt={caption}
									title={caption}
									width='100%'
									preview={false}
									style={{ cursor: 'pointer' }}
									onClick={() => navigate(`?post_id=${id}&&post_modal=1`)}
								/>
							</div>
						</Col>
					);
				})}
			</Row>

			<PostModal {...{ isUser, fetchData, username_url }} />
		</Fragment>
	);
};

export default MyPosts;
