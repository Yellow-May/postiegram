import { Avatar, Card, Carousel, Layout, Space, Image, Typography } from 'antd';
import { usePrivateAxios } from 'hooks';
import { FC, Fragment, useEffect, useState } from 'react';
import Sider from './Sider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PostedSince } from 'utils';

interface HomePageProps {}

type DataType = {
	caption: string;
	created_at: string;
	creator: { full_name: string; id: string; profile_pic: string; username: string };
	id: string;
	media: { url: string }[];
};

const HomePage: FC<HomePageProps> = () => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<DataType[]>([]);
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const fetchData = async () => {
		const res = await axiosPrivate.get('/post', { cancelToken: source.token });
		setData(res.data.posts);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();

		return () => {
			setData([]);
			source.cancel();
			setLoading(true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Fragment>
			<Layout.Content style={{ overflow: 'auto' }}>
				<Space direction='vertical' size='large' style={{ display: 'flex', minHeight: 1024 }}>
					<div className='stories'>Stories Coming Soon!</div>

					{data.map(post => (
						<Card
							key={post.id}
							className='custom-post-card'
							bordered
							loading={loading}
							title={
								<Card.Meta
									style={{}}
									avatar={<Avatar crossOrigin='anonymous' src={post.creator.profile_pic} />}
									title={
										<Link to={`/${post.creator.username}`} style={{ color: 'inherit' }}>
											{post.creator.username}
										</Link>
									}
								/>
							}>
							<div>
								<Carousel dotPosition='bottom' autoplay>
									{post.media.map(({ url }, idx) => (
										<div key={idx} className='custom-carousel-wrapper'>
											<Image crossOrigin='anonymous' src={url} title={post.caption} height={400} preview={false} />
										</div>
									))}
								</Carousel>
							</div>
							<div style={{ padding: '10px 14px' }}>
								<Space direction='vertical'>
									<Space direction='horizontal' size={5}>
										<Typography.Text strong>{post.creator.username}</Typography.Text>&nbsp;
										<Typography.Text>{post.caption}</Typography.Text>
									</Space>

									<Typography.Text type='secondary' style={{ fontSize: '0.8em' }}>
										{PostedSince(post.created_at)}
									</Typography.Text>
								</Space>
							</div>
						</Card>
					))}
				</Space>
			</Layout.Content>

			<Sider />
		</Fragment>
	);
};

export default HomePage;
