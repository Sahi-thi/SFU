export class DefaultResponse {
    public statusCode: number;
    public message: string;
}

export class IngredientListResponse {
    public statusCode: number;
    public meta_data: MetaData;
    public ingredients: Ingredients[];
}

export class Ingredients {
    id: number;
    name: string;
    created_date: string;
    updated_date: string;
}

export class MetaData {
    total: number
    page: number
    page_count: number

}