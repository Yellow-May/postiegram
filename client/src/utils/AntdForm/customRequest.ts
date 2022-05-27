import { uploadAppend } from 'utils';

// custom request for the Upload to prevent initial image upload and create and attach FormData to each file for upload
const customRequest = ({ file, onSuccess }: any) => {
	const formData = uploadAppend(file, 'post');
	setTimeout(() => {
		onSuccess(formData);
	}, 0);
};

export default customRequest;
