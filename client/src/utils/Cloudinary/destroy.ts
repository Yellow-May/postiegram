import { axiosCloudinary } from 'apis/axios';
import sha1 from 'sha1';

const destroyRequest = async (public_id: string) => {
	const timestamp = new Date().getTime().toString();
	const string = `public_id=${public_id}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET as string}`;
	const signature = sha1(string);

	const formData = new FormData();
	formData.append('public_id', public_id);
	formData.append('signature', signature);
	formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY as string);
	formData.append('timestamp', timestamp);

	const res = await axiosCloudinary('/destroy', { data: formData });
	return res.data;
};

export default destroyRequest;
