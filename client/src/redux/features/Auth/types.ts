export enum UserRole {
	all = 2001,
	admin = 1998,
}

export type UserType = {
	id: string;
	role: UserRole;
	username: string;
	profile: {
		full_name: string;
		profile_pic: {
			url: string;
			public_id: string;
		};
	};
};

export interface AuthState {
	loading: boolean;
	user: UserType | null;
	token: string | null;
}

export interface FormRegisterValuesProps {
	full_name: string;
	email: string;
	username: string;
	password: string;
	'confirm-password': string;
	profile_pic: {
		name: string;
		url: string;
		public_id: string;
	};
}

export interface FormLoginValuesProps {
	email: string;
	password: string;
}

export type AuthPayloadType = {
	method: 'get' | 'post' | 'patch';
	endpoint: 'login' | 'register' | 'logout' | 'refresh';
	data?: FormLoginValuesProps | FormRegisterValuesProps;
};
