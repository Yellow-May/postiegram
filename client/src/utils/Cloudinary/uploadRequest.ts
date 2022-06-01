import { message } from 'antd';
import { axiosCloudinary } from 'apis/axios';
import { CancelTokenSource } from 'axios';

const uploadRequest = async (formData: FormData, source: CancelTokenSource) => {
	try {
		const res = await axiosCloudinary('/upload', { data: formData, cancelToken: source.token });
		return res.data;
	} catch (error) {
		console.log(error);
		message.error('Please try again later');
	}
};

export default uploadRequest;
