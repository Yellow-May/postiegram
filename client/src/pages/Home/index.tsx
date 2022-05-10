import { FC, useState } from 'react';
import { useLogout, usePrivateAxios } from 'hooks';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
	const [data, setData] = useState<any | null>(null);
	const axiosPrivate = usePrivateAxios();
	const logout = useLogout();

	const getUsers = async () => {
		try {
			const res = await axiosPrivate.get('/user');
			setData(res.data.users);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main>
			<h1>Home Page</h1>
			<button onClick={getUsers}>Get Users</button>
			<button onClick={logout}>Logout</button>

			<ul>{data && data.map((e: any, idx: number) => <li key={idx}>{e.username}</li>)}</ul>
		</main>
	);
};

export default HomePage;
