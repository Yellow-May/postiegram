import { FC } from 'react';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import HeaderMenu from './Menu';
import SearchBar from './SearchBar';

interface HeaderProps {
	isVisible: boolean;
	openCreatePostModal: () => void;
}

const Header: FC<HeaderProps> = ({ isVisible, openCreatePostModal }) => {
	return (
		<Layout.Header
			style={{
				backgroundColor: '#f9f9f9',
				borderBottom: 'thin solid #bebebe',
				padding: 0,
			}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					maxWidth: 960,
					margin: 'auto',
					display: 'flex',
					alignItems: 'center',
				}}>
				<div
					className='logo'
					style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography.Title level={2} italic style={{ margin: 0 }}>
						<Link to='/' style={{ color: 'inherit' }}>
							Postiegram
						</Link>
					</Typography.Title>

					<SearchBar />
				</div>

				<HeaderMenu {...{ isVisible, openCreatePostModal }} />
			</div>
		</Layout.Header>
	);
};

export default Header;
