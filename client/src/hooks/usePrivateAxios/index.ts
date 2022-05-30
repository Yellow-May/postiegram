import { useEffect } from 'react';
import axios from 'apis/axios';
import useRefreshToken from '../useRefreshToken';
import { useSelector } from 'react-redux';
import { getAcToken } from 'redux/features/Auth';
import { useLocation, useNavigate } from 'react-router-dom';

const usePrivateAxios = () => {
	const rfToken = useRefreshToken();
	const acToken = useSelector(getAcToken);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const requestInterceptor = axios.interceptors.request.use(
			config => {
				if (config.headers && !config.headers?.Authorization) config.headers.Authorization = `Bearer ${acToken}`;

				return config;
			},
			error => Promise.reject(error)
		);

		const responseInterceptor = axios.interceptors.response.use(
			response => response,
			async error => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAcToken = await rfToken();
					prevRequest.headers.Authorization = `Bearer ${newAcToken}`;
					return axios(prevRequest);
				}
				if (error?.response?.status === 404) {
					navigate('/not-found', { state: { from: location } });
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.request.eject(requestInterceptor);
			axios.interceptors.response.eject(responseInterceptor);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [acToken, rfToken]);

	return axios;
};

export default usePrivateAxios;
