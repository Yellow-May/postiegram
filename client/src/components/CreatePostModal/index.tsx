import {
	FC,
	Dispatch,
	SetStateAction,
	MouseEvent,
	useState,
	ChangeEvent,
	useEffect,
} from 'react';
import {
	Modal,
	Form,
	Input,
	Row,
	Col,
	Image,
	Button,
	Upload,
	message,
	Spin,
} from 'antd';
import Picker, { IEmojiData, SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import ImgCrop from 'antd-img-crop';
import {
	UploadFile,
	RcFile,
	UploadChangeParam,
} from 'antd/lib/upload/interface';
import { customRequestPost, uploadRequest } from 'utils';
import { usePrivateAxios } from 'hooks';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getUser } from 'redux/features/Auth';

interface CreatePostModalProps {
	isVisible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
}

const CreatePostModal: FC<CreatePostModalProps> = ({
	isVisible,
	setVisible,
}) => {
	/**
	 * State
	 * form - antd Form instance to handle validation, get and set values outside of the Form wrapper
	 * imgPreview - state to store the selected media that has been uploaded
	 * isOpen - state to handle the toggling of the emoji picker
	 * axioPrivate instance to handle private request to create a post
	 */
	const [form] = Form.useForm();
	const [imgPreview, setPreview] = useState<string | null>(null);
	const [isOpen, setisOpen] = useState(false);
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();
	const user = useSelector(getUser);

	// handles the adding of emoji to the Input.TextArea
	const onEmojiClick = async (
		_event: MouseEvent<Element, globalThis.MouseEvent>,
		data: IEmojiData
	) => {
		const { emoji } = data;
		const prevCaption: string | undefined = form.getFieldValue('caption');
		form.setFieldsValue({ caption: `${prevCaption || ''}${emoji}` });
	};

	// handles the toggling of the isOpen state
	const toggleEmojiPicker = () => setisOpen(prev => !prev);

	// custom count validation for the Input.TextArea to accomodate the emojis inclusion
	const formatter = ({
		count,
		maxLength,
	}: {
		count: number;
		maxLength?: number | undefined;
	}) => {
		const caption: string | undefined = form.getFieldValue('caption');
		count = !caption ? 0 : caption.length;
		return `${count}/${maxLength}`;
	};

	// custom onChange handler for the Input.TextArea to accomodate the emojis inclusion
	const onChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		value.length > 150 && form.setFieldsValue({ caption: value.slice(0, 150) });
	};

	// hanldes the updating of the imgPreview state
	const onPreview = async (file: UploadFile) => {
		const src = await new Promise(resolve => {
			const reader = new FileReader();
			reader.readAsDataURL(file.originFileObj as RcFile);
			reader.onload = () => resolve(reader.result);
		});
		setPreview(src as string);
	};

	/**
	 * custom onChange handler for the Upload to manually update the Form state using the form instance
	 * and also update the imgPreview state
	 * */
	const onChangeUpload = async ({
		fileList,
	}: UploadChangeParam<UploadFile<any>>) => {
		if (fileList.length === 0) {
			setPreview(null);
			form.setFieldsValue({ media: null });
		} else {
			const lastImg = fileList[fileList.length - 1];
			const src = await new Promise(resolve => {
				const reader = new FileReader();
				reader.readAsDataURL(lastImg.originFileObj as RcFile);
				reader.onload = () => resolve(reader.result);
			});
			setPreview(src as string);
			form.setFieldsValue({ media: fileList });
		}
	};

	// reset all states and variables onClose of the modal
	const reset = () => {
		setPreview(null);
		setisOpen(false);
		source.cancel();
		form.resetFields();
		setVisible(false);
	};

	/**
	 * handles the onOk button for the modal
	 * Also performs the Form validation and upload before closing the modal
	 */
	const source = axios.CancelToken.source();
	const mutation = useMutation({
		mutationFn: async () => {
			const values = await form.validateFields();
			const media = await Promise.all(
				values.media.map(
					async ({ name, response }: { name: string; response: FormData }) => {
						const data = await uploadRequest(response, source);
						return {
							name,
							url: data.secure_url,
							public_id: data.public_id,
						};
					}
				)
			);
			await axiosPrivate.post(
				'/posts',
				{ caption: values.caption, media },
				{ cancelToken: source.token }
			);
		},
		onSuccess: () => {
			setVisible(false);
			message.success('Post created');
			queryClient.invalidateQueries([
				'posts',
				{ username: user?.username, bookmarked: false },
			]);
			queryClient.setQueryData(['user', user?.username], (prev: any) => {
				const new_total = prev.total_posts ? prev.total_posts + 1 : 1;
				return { ...prev, total_posts: new_total };
			});
		},
	});

	const modalProps = {
		title: 'Create New Post',
		visible: isVisible,
		cancelText: 'Discard',
		okText: 'Create',
		width: 960,
		centered: true,
		forceRender: true,
		onCancel: reset,
		onOk: () => mutation.mutate(),
		okButtonProps: { loading: mutation.isLoading },
	};

	useEffect(() => {
		// component cleanup on force-close or unmounting
		return () => reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Modal {...modalProps}>
			{!mutation.isLoading ? (
				<Row>
					<Col {...{ sm: 11, md: 11, lg: 11 }}>
						<div
							style={{
								width: 390,
								height: 390,
								border: 'thin solid #e3e3e3',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							{imgPreview ? (
								<Image
									src={imgPreview}
									preview={false}
									width='100%'
									height='100%'
								/>
							) : (
								'Upload an image or video'
							)}
						</div>
					</Col>

					<Col {...{ sm: 13, md: 13, lg: 13 }}>
						<Form
							form={form}
							layout='vertical'
							name='create-post-form'
							style={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}>
							<Form.Item
								name='caption'
								label='Enter Caption'
								rules={[{ required: true, message: 'Caption is required' }]}>
								<Input.TextArea
									showCount={{ formatter }}
									maxLength={150}
									onChange={onChangeTextArea}
									style={{ height: 150 }}
								/>
							</Form.Item>
							<div style={{ position: 'relative', top: -60, left: 5 }}>
								<Button onClick={toggleEmojiPicker}>😀</Button>
								<div
									style={{
										position: 'fixed',
										top: 0,
										left: 0,
										zIndex: isOpen ? 29 : 0,
										display: isOpen ? '' : 'none',
										background: '#00000011',
										width: '100%',
										height: '100%',
									}}
									onClick={toggleEmojiPicker}></div>
								<div
									style={{
										position: 'absolute',
										zIndex: isOpen ? 30 : 0,
										opacity: isOpen ? 1 : 0,
									}}>
									<Picker
										onEmojiClick={onEmojiClick}
										skinTone={SKIN_TONE_MEDIUM_DARK}
									/>
								</div>
							</div>

							<Form.Item
								name='media'
								label='Uploads'
								rules={[
									{
										required: true,
										message: 'Minimum of 1 upload is required',
									},
								]}>
								<ImgCrop quality={0.8} rotate>
									<Upload
										listType='picture-card'
										maxCount={3}
										customRequest={customRequestPost}
										onChange={onChangeUpload}
										onPreview={onPreview}>
										{(!form.getFieldValue('media') ||
											(form.getFieldValue('media') as []).length < 3) &&
											'+ Upload'}
									</Upload>
								</ImgCrop>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			) : (
				<div
					style={{
						height: 360,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Spin size='large' />
				</div>
			)}
		</Modal>
	);
};

export default CreatePostModal;
