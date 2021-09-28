export class SearchUsersListResponse {
    data: Array<SearchUser>;
    message: string;
    statusCode: number;
}

export class SearchUser {
    name: string;
    email: string;
    quickblox_id: number;
    disable: boolean;
    profile_pic_thumb_url: string;
    user_role: string;
}
