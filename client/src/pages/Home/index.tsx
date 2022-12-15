import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Card, Carousel, Layout, Space, Image, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { BookmarkPost, LikePost } from 'components';
import { useDimensions, usePrivateAxios } from 'hooks';
import { PostedSince } from 'utils';
import { PostType } from 'types';
import Sider from './Sider';

const HomePage = () => {
	const axiosPrivate = usePrivateAxios();
	const { width } = useDimensions();

	const { isLoading, data } = useQuery(
		['posts', { username: null, bookmarked: null }],
		async () => {
			const res = await axiosPrivate.get('/posts');
			return res.data.posts as PostType[];
		}
	);

	return (
		<Fragment>
			<Layout.Content
				style={{
					overflow: 'auto',
					paddingBottom: 32,
					paddingRight: width < 480 ? '2.5%' : '',
					paddingLeft: width < 480 ? '2.5%' : '',
					maxWidth: width < 1024 ? 610 : '',
					margin: width < 1024 ? 'auto' : '',
				}}>
				<Space
					direction='vertical'
					size='large'
					style={{ display: 'flex', minHeight: 1024 }}>
					<div className='stories' style={{ width: 610 }}>
						Stories Coming Soon!
					</div>

					{data?.map(post => (
						<Card
							key={post._id}
							className='custom-post-card'
							bordered
							loading={isLoading}
							title={
								<Card.Meta
									avatar={
										<Avatar
											crossOrigin='anonymous'
											src={post.creator.profile.profile_pic.url}
										/>
									}
									title={
										<Link
											to={`/${post.creator.username}`}
											style={{ color: 'inherit' }}>
											{post.creator.username}
										</Link>
									}
								/>
							}>
							<div>
								<Carousel dotPosition='bottom' autoplay>
									{post.media.map(({ url }, idx) => (
										<div key={idx} className='custom-carousel-wrapper'>
											<Image
												crossOrigin='anonymous'
												src={url}
												title={post.caption}
												height={400}
												preview={false}
											/>
										</div>
									))}
								</Carousel>
							</div>
							<div style={{ padding: '10px 14px' }}>
								<Space direction='vertical' style={{ width: '100%' }}>
									<div
										style={{
											width: '100%',
											display: 'flex',
											alignItems: 'center',
										}}>
										<LikePost {...{ post, queryKey: ['posts'] }} />

										<BookmarkPost {...{ post, queryKey: ['posts'] }} />
									</div>

									<Space direction='horizontal' size={5}>
										<Typography.Text strong>
											{post.creator.username}
										</Typography.Text>
										&nbsp;
										<Typography.Text>{post.caption}</Typography.Text>
									</Space>

									<Typography.Text
										type='secondary'
										style={{ fontSize: '0.8em' }}>
										{PostedSince(post.createdAt)}
									</Typography.Text>
								</Space>
							</div>
						</Card>
					))}
				</Space>
			</Layout.Content>

			{width >= 1024 && <Sider />}
		</Fragment>
	);
};

export default HomePage;
