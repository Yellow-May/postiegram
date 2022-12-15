import { usePrivateAxios } from 'hooks';
import { List, Button, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserType } from 'types';

const ListItem = ({ bot }: { bot: UserType }) => {
	const axiosPrivate = usePrivateAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			return await axiosPrivate.patch('/users/toggle-follow?follow=true', {
				user_id: bot._id,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
			queryClient.invalidateQueries(['bot-users']);
		},
	});

	return (
		<List.Item
			actions={[
				<Button type='primary' size='small' onClick={() => mutation.mutate()}>
					follow
				</Button>,
			]}>
			<List.Item.Meta
				avatar={
					<Avatar crossOrigin='anonymous' src={bot.profile.profile_pic.url} />
				}
				title={<Link to={`/${bot.username}`}>{bot.username}</Link>}
				description={bot.profile.full_name}
			/>
		</List.Item>
	);
};

export default ListItem;
