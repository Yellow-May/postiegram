import { useState } from 'react';
import { BotUserType } from '.';
import { usePrivateAxios } from 'hooks';
import { List, Button, Avatar } from 'antd';
import { Link } from 'react-router-dom';

const ListItem = ({
	bot,
	refetchPosts,
	refetchBots,
}: {
	bot: BotUserType;
	refetchPosts: any;
	refetchBots: any;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = usePrivateAxios();

	const followUser = async (user_id: string) => {
		setIsLoading(true);
		await axiosPrivate.post('/user/follow', { user_id });
		setIsLoading(false);
		refetchPosts();
		refetchBots();
	};

	return (
		<List.Item
			actions={[
				<Button
					type='primary'
					size='small'
					onClick={() => followUser(bot.id)}
					disabled={isLoading}
					loading={isLoading}>
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
