import { Layout, Typography, Button } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnAuthorizedPageProps {}

const UnAuthorizedPage: FC<UnAuthorizedPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content
			style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<Typography.Title>You are UnAuthorized to access this Page!!!</Typography.Title>
			<Button onClick={() => navigate(-1)}>Return Back</Button>
		</Layout.Content>
	);
};

export default UnAuthorizedPage;
