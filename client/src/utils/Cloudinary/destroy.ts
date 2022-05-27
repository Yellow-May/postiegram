import { axiosCloudinary } from 'apis/axios';
import sha1 from 'sha1';

const destroyRequest = async (public_id: string, type: 'profile-pic' | 'post') => {
	const timestamp = new Date().getTime().toString();
	const string = `public_id=${public_id}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET as string}`;
	const signature = sha1(string);
	const preset =
		type === 'post'
			? process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
			: process.env.REACT_APP_CLOUDINARY_PROFILE_PIC_UPLOAD_PRESET;

	const formData = new FormData();
	formData.append('public_id', public_id);
	formData.append('signature', signature);
	formData.append('api_key', preset as string);
	formData.append('timestamp', timestamp);

	const res = await axiosCloudinary('/destroy', { data: formData });
	return res.data;
};

export default destroyRequest;
