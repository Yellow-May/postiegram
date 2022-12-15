export enum UserRole {
	all = 2001,
	admin = 1998,
}

export type UserInteractionType = {
	_id: string;
	user_id: string;
};

export type UserType = {
	_id: string;
	role: UserRole;
	username: string;
	profile: {
		full_name: string;
		bio: string;
		profile_pic: {
			name: string;
			url: string;
			public_id: string;
		};
	};
	followers: UserInteractionType[];
	following: UserInteractionType[];
	total_posts?: number;
};

type MediaType = {
	_id: string;
	url: string;
};

export type PostType = {
	_id: string;
	caption: string;
	media: MediaType[];
	creator_id: string;
	creator: UserType;
	likes: UserInteractionType[];
	bookmarks: UserInteractionType[];
	subscribers: UserInteractionType[];
	createdAt: string;
};
