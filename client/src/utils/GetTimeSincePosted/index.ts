const sec = 1000;
const min = 60 * sec;
const hr = 60 * min;
const day = 24 * hr;
const wk = 7 * day;
const mth = 30 * day;
const yr = 365 * day;

const time_diff = (time_string: string) => {
	return new Date().getTime() - new Date(time_string).getTime();
};

const PostedSince = (created_at: string) => {
	const time = time_diff(created_at);
	let x = 0;
	let type;

	if (time < min) {
		// if time is less than a minute
		return 'less than a minute ago';
	} else if (time > min && time < hr) {
		// if time is greater than a minute but less than an hour
		x = Math.floor(time / min);
		type = 'minute';
	} else if (time > hr && time < day) {
		// if time is greater than an hour but less than a day
		x = Math.floor(time / hr);
		type = 'hour';
	} else if (time > day && time < wk) {
		// if time is greater than a day but less than a week
		x = Math.floor(time / day);
		type = 'day';
	} else if (time > wk && time < mth) {
		// if time is greater than a week but less than a month
		x = Math.floor(time / wk);
		type = 'week';
	} else if (time > mth && time < yr) {
		// if time is greater than a month but less than a year
		x = Math.floor(time / mth);
		type = 'month';
	} else if (time > yr) {
		// if time is greater than a year
		x = Math.floor(time / yr);
		type = 'year';
	}

	return x > 1 ? `${x} ${type}s ago` : `${x} ${type} ago`;
};

export default PostedSince;
