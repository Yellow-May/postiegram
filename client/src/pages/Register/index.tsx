import { FC } from 'react';
import { Link, useNavigate, useLocation, Location } from 'react-router-dom';
import { Form, Input, Button, Space } from 'antd';
import axios from 'apis/axios';
import { RegisterUser } from 'redux/features/Auth';
import { useAppDispatch } from 'redux/store';
import { FormRegisterValuesProps } from 'redux/features/Auth/types';

interface RegisterPageProps {}

type LocationState = {
	from: Location;
} | null;

const RegisterPage: FC<RegisterPageProps> = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as LocationState;
	const dispatch = useAppDispatch();

	const onFinish = (values: FormRegisterValuesProps) => {
		dispatch(RegisterUser(values));
		navigate(!state || state?.from?.pathname === '/login' ? '/' : state?.from, { replace: true });
	};

	return (
		<main
			style={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Space direction='vertical' style={{ width: 480, maxWidth: '95%' }}>
				<Form
					name='registration'
					className='register-form'
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					onFinish={onFinish}
					autoComplete='off'
					style={{ border: 'thin solid #e3e3e3', padding: 24 }}>
					<Form.Item
						label='Username'
						name='username'
						hasFeedback
						rules={[
							{ required: true, message: 'Please input a unique username!' },
							() => ({
								async validator(_, value) {
									try {
										await axios.post('/user/confirm-username', {
											username: value.trim(),
										});
										return Promise.resolve();
									} catch (error: any) {
										console.log(error);
										const message = error?.response?.data?.message || error.message;
										return Promise.reject(new Error(message));
									}
								},
							}),
						]}>
						<Input />
					</Form.Item>

					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: 'Please input an email!' },
							{ type: 'email', message: 'Please provide a valid email' },
						]}>
						<Input />
					</Form.Item>

					<Form.Item
						label='Password'
						name='password'
						rules={[
							{ required: true, message: 'Please input a password!' },
							{ min: 6, message: 'Password must be more than 6 chars' },
						]}>
						<Input.Password />
					</Form.Item>

					<Form.Item
						label='Re-password'
						name='confirm-password'
						dependencies={['password']}
						hasFeedback
						rules={[
							{ required: true, message: 'Please confirm password' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error('The two passwords that you entered do not match!')
									);
								},
							}),
						]}>
						<Input.Password />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ marginBottom: 0 }}>
						<Button type='primary' htmlType='submit' block className='register-form-button'>
							Create Account
						</Button>
					</Form.Item>
				</Form>

				<div style={{ border: 'thin solid #e3e3e3', padding: 16, textAlign: 'center' }}>
					Already registered? <Link to='/login'>Login</Link>
				</div>
			</Space>
		</main>
	);
};

export default RegisterPage;
