export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class AnalyticResponse {
    statusCode: number
    message: string
    total_users: number
    total_services: number
    total_products: number
    total_appointments:number
    data: AnalyticData[]
}

export class AnalyticData {
    count: number
    week: string
    date: string
}
