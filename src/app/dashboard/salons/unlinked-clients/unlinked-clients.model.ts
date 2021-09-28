export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class UnlinkedClientsResponse {
    statusCode: number;
    clients: UnlinkedClients[];
    meta_data: MetaData;
    message: string;
}
export class UnlinkedClients {
    client_id: number;
    created_date:string;
    email: string;
    name: string;
    profile_pic_thumb_url: string;
    profile_pic_url: string;
    phone_number: number;
}
export class UnLinkedClientInfoResponse {
    statusCode: number;
    information: UnLinkedClientInformation;
    message: string
}

export class UnLinkedClientInformation {
    id: number;
    email: string;
    password: string;
    name: string;
    profile_pic_s3_key_id: string;
    phone_number: number;
    user_role: string;
    is_push_notification: number;
    status: string;
    is_password_set: number;
    quickblox_id: number;
    is_chat_screen: number;
    created_date: string;
    updated_date: string;
    client_id: number;
    profile_pic_thumb_url: string;
    profile_pic_url: string;
    question_answer: QuestionAnswer[]
}
export class QuestionAnswer {
    question_id: number
    question: string;
    options: QuestionOptions[]
}

export class QuestionOptions {
    option: string
    option_id: number
    other_text: string
}