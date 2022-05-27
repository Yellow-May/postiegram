import { Layout, Space } from 'antd';
import { usePrivateAxios } from 'hooks';
import { FC, Fragment, useEffect } from 'react';
import Sider from './Sider';
import axios from 'axios';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
	const axiosPrivate = usePrivateAxios();
	const source = axios.CancelToken.source();
	const fetchData = async () => {
		const res = await axiosPrivate.get('/post', { cancelToken: source.token });
		console.log(res.data);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Fragment>
			<Layout.Content style={{ overflow: 'auto' }}>
				<Space direction='vertical' size='large' style={{ display: 'flex', minHeight: 1024 }}>
					<div className='stories'>Stories Coming Soon!</div>
				</Space>
			</Layout.Content>

			<Sider />
		</Fragment>
	);
};

export default HomePage;
