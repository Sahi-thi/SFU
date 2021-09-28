export class NotesResponse {
    statusCode: number;
    meta_data: MetaData;
    notes: NotesData[];
    message: string;
}

export class MetaData {
    total: number;
    page_count: number;
    page: number;
}

export class NotesData {
    id: number;
    note: string;
    client_id: number;
    salon_id: number;
}
