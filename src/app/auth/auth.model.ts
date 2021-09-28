
export class DefaultResponse {
    public statusCode: number;
    public message: string;
}

export class LoginResponse {
    public statusCode: number;
    public is_password_set: number;
    public token: string;
    public authorization: string;
    public message: string;
    public user: User;
}

export class ForgotResponse {
    public statusCode: number;
    public token: string;
    public message: string;
}

export class User {
    id: string;
    salon_id: string;
    name: string;
    email: string;
    phone_number: number;
    user_role: string;
    services: string;
    days_in_office: string;
    hours_in_office: string;
    is_password_set: number;
    status: number;
}
