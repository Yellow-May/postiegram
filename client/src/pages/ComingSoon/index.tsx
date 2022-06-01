import { Button, Layout, Result } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {}

const ComingSoonPage: FC<ComingSoonPageProps> = () => {
	const navigate = useNavigate();

	return (
		<Layout.Content style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Result
				title='Coming Soon'
				subTitle='Feature coming soon'
				extra={
					<Button type='primary' onClick={() => navigate('/', { replace: true })}>
						Back Home
					</Button>
				}
			/>
		</Layout.Content>
	);
};

export default ComingSoonPage;
