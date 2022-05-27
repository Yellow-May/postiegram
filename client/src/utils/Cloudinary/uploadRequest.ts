import { message } from 'antd';
import { axiosCloudinary } from 'apis/axios';

const uploadRequest = async (formData: FormData) => {
	try {
		const res = await axiosCloudinary('/upload', { data: formData });
		return res.data;
	} catch (error) {
		console.log(error);
		message.error('Please try again later');
	}
};

export default uploadRequest;
