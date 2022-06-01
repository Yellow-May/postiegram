import { Layout, Button, Result } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {}

const NotFoundPage: FC<NotFoundPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Result
				status='404'
				title='404'
				subTitle='Sorry, the page you visited does not exist.'
				extra={
					<Button type='primary' onClick={() => navigate('/', { replace: true })}>
						Back Home
					</Button>
				}
			/>
		</Layout.Content>
	);
};

export default NotFoundPage;
