import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useDimensions } from 'hooks';
import { ScreenTooSmall } from 'components';
import store from 'redux/store';
import MyApp from 'app';
import 'styles/global.css';

const rootEl = document.getElementById('root') as HTMLElement;
const root = createRoot(rootEl);
const client = new QueryClient();

const Root = () => {
	const { width } = useDimensions();

	if (width < 768) {
		return <ScreenTooSmall />;
	}

	return (
		<QueryClientProvider client={client}>
			<BrowserRouter>
				<Provider {...{ store }}>
					<MyApp />
				</Provider>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} position='bottom-left' />
		</QueryClientProvider>
	);
};
root.render(<Root />);
