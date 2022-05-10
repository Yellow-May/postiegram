export enum UserRole {
	all = 2001,
	admin = 1998,
}

type UserType = {
	id: string;
	role: UserRole;
	username: string;
	email: string;
	img: string;
};

export interface AuthState {
	loading: boolean;
	user: UserType | null;
	token: string | null;
}

export interface FormRegisterValuesProps {
	email: string;
	username: string;
	password: string;
	'confirm-password': string;
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
