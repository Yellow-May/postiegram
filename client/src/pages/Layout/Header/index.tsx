import { FC } from 'react';
import { Layout, Typography } from 'antd';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
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
				<div className='logo'>
					<Typography.Title level={2} italic style={{ margin: 0 }}>
						Postiegram
					</Typography.Title>
				</div>
			</div>
		</Layout.Header>
	);
};

export default Header;