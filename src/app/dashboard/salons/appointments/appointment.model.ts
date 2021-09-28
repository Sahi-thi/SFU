
export class DefaultResponse {
    public statusCode: number;
    public message: string;
}
export class MetaData {
    total: number;
    page: number;
    page_count: number;
}
export class appointmentStatus {
    id: string;
    name: string;
}

export class appointmentDetails {
    client_id: number;
    date: string;
    time: string;
    status: string;
    service_ids: ServiceData[];
    product_ids: ProductData[];
    notes: string;

}
export class ProductData {
    product_id: number;
    reward_id?: number;
}
export class ServiceData {
    service_id: number;
    provider_id: number;
    provider_name: string;
    reward_id?: number;
}
export class AppointmentResponse {
    statusCode: number;
    message: string;
    appointments: Appointment[];
    meta_data: MetaData;
}
export class Appointment {
    appointment_id: number;
    client_email: string;
    client_number: number;
    status: string;
    notes: string;
    date: string;
    time: string;
    client_thumb_url: null;
}
export class GetAppointmentDetailsResponse {
    statusCode: number;
    message: string;
    appointment: GetAppointmentDetails;
}
export class GetAppointmentDetails {
    appointment_id: number;
    client_name: string;
    client_email: string;
    client_number: number;
    client_id: number;
    status: string;
    notes: string;
    date: any;
    time: string;
    client_thumb_url: null;
    services: AppointmentServicesList[];
    products: AppointmentProductsList[];
}

export class AppointmentServicesList {
    price: number;
    discount?: number;
    discount_price?: number;
    service: string;
}
export class AppointmentProductsList {
    price: number;
    product_name: string;
    discount?: number;
    discount_price?: number;

    name: string;
}

// // calendar 
export class CalendarListResponse {
    statusCode: number;
    message: string;
    appointments: CalendarAppointments[];
}

export class CalendarAppointments {
    appointment_id: number;
    client_name: string;
    end: string;
    start: string;
    status: string;
    time: string;
    client_thumb_url: null;
}

export class FormsDetails {
    appointment_id: number
    form_name: string
    form_url: string
    id: number
    pdf_url: string
    status: string
    updated_date: string
}

export class ServicesResponse {
    statusCode: number;
    services: Services[];
    meta_data: MetaData;
    message: string;
}

export class Services {
    service_id: number;
    type_id: number;
    service_type: string;
    service: string;
    price: string;
    description: string;
}
export class activeServicesResponse {
    statusCode: number;
    services: AppointmentActiveServices[];
    message: string;
}
export class AppointmentActiveServices {
    service_type: string;
    salon_services: SalonActiveServices[]
}

export class SalonActiveServices {
    min_price: string;
    provider_max_price: string;
    max_price: string;
    service_id: number;
    service_name: string;
    isServiceChecked?: boolean;
    isChecked?: boolean;
    provider_services: ProviderServices[]
    rewards: Rewards[]
}
export class Rewards {
    reward_id: number;
    discount: number;
}

export class ProviderServices {
    price: string;
    provider_name: string;
    provider_id: number;
    isChecked?: boolean;
}