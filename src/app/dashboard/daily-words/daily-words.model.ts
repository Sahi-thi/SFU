export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
}
export class DailyWordsResponse {
    statusCode: number;
    dailyWords: DailyWords[];
    quotes: DailyWords[];
    meta_data: MetaData;
}
export class DailyWords {
    id: number;
    quote: string;
    created_date: string;
    updated_date: string;
    display: string;
}
export class DailyWordsDetails {
    quote: string;
}
export class DailyWordsDetailsResponse {
    statusCode: number;
    quote: DailyWords;
}
export class uploadQuotes {
    quotes: DailyWordsDetails[];
}
