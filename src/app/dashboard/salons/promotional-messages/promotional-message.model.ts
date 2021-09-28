export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
}
export class PromotionalMessageResponse {
    statusCode: number;
    notifications: PromotionalMessages[];
    meta_data: MetaData;
}
export class PromotionalMessages {
    notification_id: number;
    salon_id: number;
    title: string;
    message: string;
    is_read: number;
    sent_time: number;
    sent_by: number;
    created_date: string;
    updated_date: string;
}

export class PromotionalMessageDetails {
    title: string;
    sent_time: number;
    message: string;
}
