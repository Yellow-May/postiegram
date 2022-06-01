import { Button, Layout, Typography } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {}

const ComingSoonPage: FC<ComingSoonPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content
			style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<Typography.Title>Coming Soon!!!</Typography.Title>
			<Button onClick={() => navigate(-1)}>Return Back</Button>
		</Layout.Content>
	);
};

export default ComingSoonPage;
