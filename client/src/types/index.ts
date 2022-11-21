export type UserType = {
	username: string;
	profile: {
		profile_pic: {
			url: string;
		};
	};
};

type UserInteractionType = {
	_id: string;
	user_id: string;
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
