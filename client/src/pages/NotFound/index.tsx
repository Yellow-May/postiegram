import { Layout, Typography, Button } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {}

const NotFoundPage: FC<NotFoundPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content
			style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<Typography.Title>Page Not Found!!!</Typography.Title>
			<Button onClick={() => navigate(-1)}>Return Back</Button>
		</Layout.Content>
	);
};

export default NotFoundPage;
