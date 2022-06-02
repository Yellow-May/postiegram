import { FC, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { usePrivateAxios } from 'hooks';
import { useSelector } from 'react-redux';
import { getIsPostCreated, togglePostCreated } from 'redux/features/Others';
import { useAppDispatch } from 'redux/store';
import { Col, Row, Image, Modal, Carousel, Typography } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { getUser } from 'redux/features/Auth';

interface MyPostsProps {}

type MediaType = {
	id: string;
	url: string;
};

type DataType = {
	id: string;
	caption: string;
	created_at: string;
	media: MediaType[];
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
	const confirmModal = (id: string) => {
		let loading = false;
		Modal.confirm({
			title: 'Are you sure you want to delete this Post?',
			centered: true,
			okButtonProps: {
				loading,
				onClick: async () => {
					loading = true;
					await axiosPrivate.delete(`/post/${id}`);
					loading = false;
					Modal.destroyAll();
					fetchData();
				},
			},
		});
	};
	const info = (post: DataType) => {
		const { caption, id, media } = post;

		Modal.info({
			title: <Typography.Title level={4}>{caption}</Typography.Title>,
			content: (
				<div>
					<Carousel autoplay dotPosition='bottom'>
						{media.map(({ id, url }) => (
							<div key={id} className='custom-carousel-wrapper'>
								<Image crossOrigin='anonymous' src={url} title={caption} height={320} preview={false} />
							</div>
						))}
					</Carousel>
				</div>
			),
			okText: !isUser ? '' : <DeleteFilled />,
			okButtonProps: !isUser ? { style: { display: 'none' } } : { danger: true, onClick: () => confirmModal(id) },
			closable: true,
			icon: null,
			maskClosable: true,
			className: 'custom-post-info-modal',
		});
	};

	return (
		<Fragment>
			<Row gutter={28}>
				{data.map(post => {
					const { caption, id, media } = post;
					const { url } = media[0];

					return (
						<Col key={id} {...{ xs: 8, sm: 8, md: 8, lg: 8 }}>
							<div style={{ width: '100%' }}>
								<Image
									crossOrigin='anonymous'
									src={url}
									alt={caption}
									title={caption}
									height={300}
									preview={false}
									style={{ cursor: 'pointer' }}
									onClick={() => info(post)}
								/>
							</div>
						</Col>
					);
				})}
			</Row>
		</Fragment>
	);
};

export default MyPosts;
