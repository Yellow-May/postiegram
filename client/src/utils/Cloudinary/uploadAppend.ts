const uploadAppend = (file: string | Blob, type: 'profile-pic' | 'post') => {
	const preset =
		type === 'post'
			? process.env.REACT_APP_CLOUDINARY_POST_UPLOAD_PRESET
			: process.env.REACT_APP_CLOUDINARY_PROFILE_PIC_UPLOAD_PRESET;
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', preset as string);
	return formData;
};

export default uploadAppend;
