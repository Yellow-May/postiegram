import { FC } from 'react';
import { Link, useNavigate, useLocation, Location } from 'react-router-dom';
import { Form, Input, Button, Space, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';
import { FormLoginValuesProps } from 'redux/features/Auth/types';

interface LoginPageProps {}

type LocationState = {
	from: Location;
} | null;

const LoginPage: FC<LoginPageProps> = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as LocationState;
	const dispatch = useAppDispatch();

	// handle submit
	const onFinish = (values: FormLoginValuesProps) => {
		dispatch(LoginUser(values));
		navigate(!state || state?.from?.pathname === '/register' ? '/' : state?.from, {
			replace: true,
		});
	};

	return (
		<main
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#ffffff',
			}}>
			<Space direction='vertical' style={{ width: 360, maxWidth: '95%' }}>
				<Typography.Title
					type='secondary'
					level={2}
					style={{ textAlign: 'center', border: 'thin solid #e3e3e3', padding: 8, margin: 0 }}>
					Login
				</Typography.Title>

				<Form
					name='login'
					className='login-form'
					onFinish={onFinish}
					autoComplete='off'
					style={{ border: 'thin solid #e3e3e3', padding: 24 }}>
					<Form.Item
						name='email'
						rules={[
							{ required: true, message: 'Please input your Email!' },
							{ type: 'email', message: 'Please enter a valid email' },
						]}>
						<Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Email' />
					</Form.Item>

					<Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
						<Input.Password
							prefix={<LockOutlined className='site-form-item-icon' />}
							type='password'
							placeholder='Password'
						/>
					</Form.Item>

					<Button type='primary' block htmlType='submit' className='login-form-button'>
						Log in
					</Button>
				</Form>

				<div style={{ border: 'thin solid #e3e3e3', padding: 16, textAlign: 'center' }}>
					Not registered? <Link to='/register'>Create account</Link>
				</div>
			</Space>
		</main>
	);
};

export default LoginPage;
