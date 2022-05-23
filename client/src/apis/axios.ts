import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL,
	withCredentials: true,
});

export const axiosCloudinary = axios.create({
	baseURL: process.env.REACT_APP_CLOUDINARY_URL,
	method: 'post',
	headers: {
		'content-type': 'multipart/form-data',
	},
});

export default instance;
