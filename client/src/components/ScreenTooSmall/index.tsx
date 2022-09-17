const ScreenTooSmall = () => {
	return (
		<div
			style={{
				minHeight: '100%',
				display: 'flex',
				alignItems: 'center',
				textAlign: 'center',
				fontSize: 10,
				padding: '0 4%',
			}}>
			<h1>
				Please access this site on a Tablet or Pc with a minimum screen width of
				768px
			</h1>
		</div>
	);
};

export default ScreenTooSmall;
