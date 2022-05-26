import { FC, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { CreatePostModal } from 'components';
import Header from './Header';

interface PageLayoutProps {}

const PageLayout: FC<PageLayoutProps> = () => {
	const [isVisible, setVisible] = useState(false);

	const openCreatePostModal = () => setVisible(true);

	return (
		<Layout style={{ flexDirection: 'column', height: '100%', backgroundColor: '#e3e3e3' }}>
			<Header {...{ isVisible, openCreatePostModal }} />

			<Layout
				style={{
					width: '100%',
					maxWidth: 960,
					margin: 'auto',
					flexGrow: 1,
					backgroundColor: '#e3e3e3',
					paddingTop: 20,
				}}>
				<Outlet />
			</Layout>

			<CreatePostModal {...{ isVisible, setVisible }} />
		</Layout>
	);
};

export default PageLayout;
