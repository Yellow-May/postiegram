import { message, Modal, Upload, Image, PageHeader, Button } from 'antd';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { usePrivateAxios } from 'hooks';
import { customRequestProfilePic, destroyRequest, uploadRequest } from 'utils';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'redux/store';
import { updateUserInfo } from 'redux/features/Auth';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface ChangeProfilePicModalProps {
	isVisible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	userInfo: {
		username: string;
		profile: {
			profile_pic: {
				_id: string;
				url: string;
				public_id: string;
			};
		};
	};
}

const ChangeProfilePicModal: FC<ChangeProfilePicModalProps> = ({
	isVisible,
	setVisible,
	userInfo,
}) => {
	const [imgPreview, setPreview] = useState('');
	const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
	const [loading, setLoading] = useState(false);
	const axiosPrivate = usePrivateAxios();
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();

	// handle onChange to save preview src and update fileList
	const onChange = async ({
		fileList: newFileList,
	}: UploadChangeParam<UploadFile<any>>) => {
		if (newFileList.length === 0) {
			setPreview('');
		} else {
			const lastImg = newFileList[0];
			const src = await new Promise(resolve => {
				const reader = new FileReader();
				reader.readAsDataURL(lastImg.originFileObj as RcFile);
				reader.onload = () => resolve(reader.result);
			});
			setPreview(src as string);
		}
		setFileList(newFileList);
	};

	// modal title prop, to navigate back when previewing
	const onBack = () => {
		setFileList([]);
		setPreview('');
	};
	const title = imgPreview ? (
		<PageHeader onBack={onBack} title='Preview Upload' style={{ padding: 0 }} />
	) : (
		'Upload New Profile Pic'
	);

	// reset all states and variables onClose of the modal
	const source = axios.CancelToken.source();
	const onCancel = () => {
		setPreview('');
		setFileList([]);
		setLoading(false);
		source.cancel();
		setVisible(false);
	};

	/**
	 * handles the onOk button for the modal
	 * Also performs the Form validation and upload before closing the modal
	 */
	const onOk = async () => {
		if (fileList[0]) {
			setLoading(true);
			const file = fileList[0];
			await destroyRequest(userInfo.profile.profile_pic.public_id);
			const data = await uploadRequest(file.response, source);
			const new_profile_pic = {
				name: file.name,
				url: data.secure_url,
				public_id: data.public_id,
			};
			const res = await axiosPrivate.post(
				'/user/update-profile-pic',
				{ new_profile_pic },
				{ cancelToken: source.token }
			);
			message.success(res.data.message);
			dispatch(updateUserInfo({ profile: res.data.user.profile }));
			queryClient.invalidateQueries(['user', userInfo.username]);
			onCancel();
		}
	};

	const modalProps = {
		title,
		visible: isVisible,
		width: 360,
		centered: true,
		onCancel,
		onOk,
		footer: [
			<Button key={1} type='primary' loading={loading} onClick={onOk}>
				Update Profile Pic
			</Button>,
		],
	};

	return (
		<Modal {...modalProps}>
			{fileList.length === 1 ? (
				<div>
					<Image
						src={imgPreview}
						preview={false}
						width='100%'
						height='100%'
						style={{ borderRadius: '50%' }}
					/>
				</div>
			) : (
				<ImgCrop quality={0.8} shape='round' rotate>
					<Upload.Dragger
						customRequest={customRequestProfilePic}
						onChange={onChange}>
						<p className='ant-upload-drag-icon'>
							<InboxOutlined />
						</p>
						<p className='ant-upload-text'>
							Click or drag file to this area to upload
						</p>
					</Upload.Dragger>
				</ImgCrop>
			)}
		</Modal>
	);
};

export default ChangeProfilePicModal;
