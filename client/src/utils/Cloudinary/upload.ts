const uploadAppend = (file: string | Blob) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET as string);
	return formData;
};

export default uploadAppend;
