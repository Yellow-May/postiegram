import { Layout, Space } from 'antd';
import { FC, Fragment } from 'react';
import Sider from './Sider';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
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
