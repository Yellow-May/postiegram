import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './Sider';
import Header from './Header';

interface PageLayoutProps {}

const PageLayout: FC<PageLayoutProps> = () => {
	return (
		<Layout style={{ flexDirection: 'column', height: '100%', backgroundColor: '#e3e3e3' }}>
			<Header />

			<Layout
				style={{
					width: '100%',
					maxWidth: 960,
					margin: 'auto',
					flexGrow: 1,
					backgroundColor: '#e3e3e3',
					paddingTop: 20,
				}}>
				<Layout.Content style={{ overflow: 'auto' }}>
					<Outlet />
				</Layout.Content>

				<Sider />
			</Layout>
		</Layout>
	);
};

export default PageLayout;
