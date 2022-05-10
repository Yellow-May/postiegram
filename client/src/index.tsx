import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';
import MyApp from 'app';
import 'styles/global.css';

const rootEl = document.getElementById('root') as HTMLElement;
const root = createRoot(rootEl);

const Root = () => (
	<StrictMode>
		<BrowserRouter>
			<Provider {...{ store }}>
				<MyApp />
			</Provider>
		</BrowserRouter>
	</StrictMode>
);
root.render(<Root />);
