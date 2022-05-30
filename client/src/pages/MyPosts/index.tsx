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

	const user = useSelector(getUser);
	const isUser = location.pathname.includes(user?.username as string);
	const info = (post: DataType) => {
		const { caption, id, media } = post;

		Modal.info({
			title: <Typography.Title level={4}>{caption}</Typography.Title>,
			content: (
				<div style={{ width: '100%' }}>
					<Carousel dotPosition='bottom'>
						{media.map(({ id, url }) => (
							<Image key={id} crossOrigin='anonymous' src={url} title={caption} width='100%' height='100%' preview={false} />
						))}
					</Carousel>
				</div>
			),
			onOk() {
				console.log(id);
			},
			okText: !isUser ? '' : <DeleteFilled />,
			okButtonProps: !isUser ? { style: { display: 'none' } } : { danger: true },
			closable: true,
			icon: null,
			maskClosable: true,
			className: 'custom-post-info-modal',
		});
	};

	return (
		<Fragment>
			<Row>
				{data.map(post => {
					const { caption, id, media } = post;
					const { url } = media[0];

					return (
						<Col key={id} {...{ xs: 8, sm: 8, md: 8, lg: 8 }}>
							<Image
								crossOrigin='anonymous'
								src={url}
								alt={caption}
								title={caption}
								width='100%'
								height='100%'
								preview={false}
								style={{ cursor: 'pointer' }}
								onClick={() => info(post)}
							/>
						</Col>
					);
				})}
			</Row>
		</Fragment>
	);
};

export default MyPosts;
