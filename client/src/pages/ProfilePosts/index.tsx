import { FC, Fragment, useMemo } from 'react';
import { usePrivateAxios } from 'hooks';
import { Col, Row, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { PostModal } from 'components';
import { useQuery } from '@tanstack/react-query';
import { PostType } from 'types';

interface ProfilePostsProps {}

const ProfilePosts: FC<ProfilePostsProps> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const axiosPrivate = usePrivateAxios();
	const username = location.pathname.split('/')[1];
	const bookmarked = location.pathname.split('/')[2] === 'saved';

	const queryKey = useMemo(
		() => ['posts', { username, bookmarked }],
		[username, bookmarked]
	);
	const { data } = useQuery(queryKey, async () => {
		const url = bookmarked
			? `/posts?bookmarked=true`
			: `/posts?username=${username}`;
		const res = await axiosPrivate.get(url);
		return res.data.posts as PostType[];
	});

	return (
		<Fragment>
			<Row
				gutter={[24, 24]}
				style={{ marginRight: 0, marginLeft: 0, paddingBottom: 24 }}>
				{data?.map(post => {
					const { caption, _id, media } = post;
					const { url } = media[0];

					return (
						<Col key={_id} {...{ xs: 8, sm: 8, md: 8, lg: 8 }}>
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
									onClick={() => navigate(`?post_id=${_id}&&post_modal=1`)}
								/>
							</div>
						</Col>
					);
				})}
			</Row>

			<PostModal {...{ queryKey }} />
		</Fragment>
	);
};

export default ProfilePosts;
