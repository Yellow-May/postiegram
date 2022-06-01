import { Layout, Button, Result } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnAuthorizedPageProps {}

const UnAuthorizedPage: FC<UnAuthorizedPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Result
				status='403'
				title='403'
				subTitle='Sorry, you are not authorized to access this page.'
				extra={
					<Button type='primary' onClick={() => navigate('/', { replace: true })}>
						Back Home
					</Button>
				}
			/>
		</Layout.Content>
	);
};

export default UnAuthorizedPage;
