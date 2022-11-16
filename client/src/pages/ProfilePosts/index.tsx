import { FC, Fragment } from 'react';
import axios from 'axios';
import { usePrivateAxios } from 'hooks';
import { useSelector } from 'react-redux';
import { Col, Row, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';
import { PostModal } from 'components';
import { useQuery } from '@tanstack/react-query';

interface ProfilePostsProps {}

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

const ProfilePosts: FC<ProfilePostsProps> = () => {
	const location = useLocation();
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const username_url = location.pathname.split('/')[1];
	const saved = location.pathname.split('/')[2] === 'saved';

	const { data } = useQuery(['my-posts', { username_url, saved }], async () => {
		const url = saved ? `/post/bookmarked` : `/post/${username_url}`;
		const res = await axiosPrivate.get(url, {
			cancelToken: source.token,
		});
		return res.data.posts as DataType[];
	});

	const user = useSelector(getUser);
	const isUser = location.pathname.includes(user?.username as string);
	const navigate = useNavigate();

	return (
		<Fragment>
			<Row gutter={24} style={{ margin: 0 }}>
				{data?.map(post => {
					const { caption, id, media } = post;
					const { url } = media[0];

					return (
						<Col key={id} {...{ xs: 8, sm: 8, md: 8, lg: 8 }}>
							<div
								className='custom-img-wrapper'
								style={{
									height: 300,
									border: 'thin solid',
									overflow: 'hidden',
								}}>
								<Image
									crossOrigin='anonymous'
									src={url}
									alt={caption}
									title={caption}
									width='100%'
									preview={false}
									style={{ cursor: 'pointer', maxHeight: '100%' }}
									onClick={() => navigate(`?post_id=${id}&&post_modal=1`)}
								/>
							</div>
						</Col>
					);
				})}
			</Row>

			<PostModal {...{ isUser, username_url, saved }} />
		</Fragment>
	);
};

export default ProfilePosts;
