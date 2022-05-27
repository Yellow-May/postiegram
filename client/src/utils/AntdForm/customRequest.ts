import { uploadAppend } from 'utils';

// custom request for the Upload to prevent initial image upload and create and attach FormData to each file for upload
const customRequestPost = ({ file, onSuccess }: any) => {
	const formData = uploadAppend(file, 'post');
	setTimeout(() => {
		onSuccess(formData);
	}, 0);
};

const customRequestProfilePic = ({ file, onSuccess }: any) => {
	const formData = uploadAppend(file, 'profile-pic');
	setTimeout(() => {
		onSuccess(formData);
	}, 0);
};

export { customRequestPost, customRequestProfilePic };
