import { Button } from 'antd';
import { BookmarkFilledIcon, BookmarkOutlinedIcon } from 'components/Icons';
import { useState } from 'react';

const BookmarkPost = () => {
	const [saved, setSaved] = useState(false);

	const bookmarkReq = () => {
		setSaved(prev => !prev);
	};

	return (
		<Button
			icon={saved ? <BookmarkFilledIcon /> : <BookmarkOutlinedIcon />}
			onClick={bookmarkReq}
		/>
	);
};

export default BookmarkPost;
