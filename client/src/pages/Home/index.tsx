import { Space } from 'antd';
import { FC } from 'react';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
	return (
		<Space direction='vertical' size='large' style={{ display: 'flex', minHeight: 1024 }}>
			<div className='stories'>Stories Coming Soon!</div>
		</Space>
	);
};

export default HomePage;
