import { Avatar, Input, List } from 'antd';
import { usePrivateAxios } from 'hooks';
import { ChangeEvent, FC, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { CancelTokenSource } from 'axios';
import { UserType } from 'types';

interface SearchBarProps {}

let source: CancelTokenSource | null;

const SearchBar: FC<SearchBarProps> = () => {
	const [value, setValue] = useState('');
	const [results, setResults] = useState<UserType[]>([]);
	const axiosPrivate = usePrivateAxios();

	const resetResults = () => {
		setValue('');
		setResults([]);
		source && source.cancel();
	};

	const searchRequest = async (value: string) => {
		if (source) source.cancel('Operation canceled due to new request.');
		source = axios.CancelToken.source();
		const res = await axiosPrivate.get(`/users?q=${value}`, {
			cancelToken: source.token,
		});
		setResults(res.data.users);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setValue(value);
		value ? searchRequest(value) : resetResults();
	};

	return (
		<div
			style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
			<Input.Search
				placeholder='search users...'
				allowClear
				value={value}
				onChange={onChange}
				style={{ width: 200, marginRight: 96 }}
			/>

			{results.length > 0 && (
				<List
					className='custom-search-list'
					itemLayout='horizontal'
					dataSource={results}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										crossOrigin='anonymous'
										src={item.profile.profile_pic.url}
									/>
								}
								title={
									<Link to={`/${item.username}`} onClick={resetResults}>
										{item.profile.full_name}
									</Link>
								}
								description={item.profile.bio}
							/>
						</List.Item>
					)}
				/>
			)}
		</div>
	);
};

export default SearchBar;
