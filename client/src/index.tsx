import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MyApp from './app';

const rootEl = document.getElementById('root') as HTMLElement;
const root = createRoot(rootEl);

const Root = () => (
	<StrictMode>
		<BrowserRouter>
			<MyApp />
		</BrowserRouter>
	</StrictMode>
);
root.render(<Root />);
