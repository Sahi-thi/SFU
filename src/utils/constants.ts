import {
    appointmentStatus,
    DaysStatus,
    MenuList,
    Status
} from 'src/app/dashboard/dashboard.model';
import { RitualArray } from '../app/dashboard/salons/recommendations/recommendation.model';

export class Constants {
    // s3 constants
    // public static bucketName = "brainbreak-media-dev"  // dev
    // public static bucketName =  "brainbreak-media-stage"  // stage
    public static skinForYou = 'Skin For You | ';
    public static salons = 'Studios';
    public static details = 'Details';
    public static clients = 'Clients';
    public static clientsInfo = 'Clients Information';
    public static routine = 'Clients Routine';
    public static signedForms = 'Clients Signed Forms';
    public static providers = 'Providers';
    public static brands = 'Brands';
    public static salonbrands = 'Salon Brands';
    public static recommendations = 'Recommendations';
    public static overViewAnalytics = 'Over View Analytics';
    public static services = 'Services';
    public static appointmentTab = 'Appointments';

    // auth service
    public static login = 'auth/login';
    public static forgotPassword = 'auth/forgotPassword';
    public static resetPassword = 'auth/resetPassword';

    // ********** dashboard service **********
    public static logout = 'auth/logout';

    // Salon
    public static salonsList = 'salon/';
    public static statesList = 'salon/state/list';
    public static addSalon = 'salon/createSalon';
    public static salon = 'salon/';
    public static salonService = 'service/list';
    public static salonActiveService = 'service/active/list';
    public static serviceTypeDropdown = 'service/types';

    // Clients
    public static client = '/client/';
    public static info = '/info';
    public static clientRoutine = '/routine';
    public static clientRoutineDetails = '/routine/detail';
    public static clientList = '/client/list';

    // Providers
    public static providerList = '/provider/list';
    public static provider = '/provider/';
    public static providerCreate = '/provider/add';

    // Service
    public static service = '/service/';
    public static serviceList = '/service/list';
    public static activeServiceList = '/service/active/list';
    public static serviceAdd = '/service/add';

    // Brands
    // public static brand = 'brand';
    // public static brandList = 'brand/list';
    public static brandManage = 'brand/manage/list';
    public static brandManageUpdate = 'brand/manage/list/update';
    public static brandAdd = '/createbrand';
    public static brandEdit = '/editbrand';
    public static brandsDropdown = 'brand/info';

    // Brands 
    public static brandList = 'brand/list';
    public static brand = 'brand';
    public static createBrand = 'brand/createBrand';
    // Products
    public static products = 'product';
    public static productsManage = '/products/manage';
    public static productsManageUpdate = '/products/manage/update';
    public static createProduct = '/product/createProduct';
    public static productsDropdown = '/product/info';

    //recommendations
    public static recommendation = '/recommendation';
    public static recommendationList = '/recommendation/list';
    public static recommendationServiceList = '/recommendation/service/list';
    public static recommendationFilter = '/recommendation/product/list';
    public static recommendationDropdownDetails =
        '/recommendation/brand/list';
    public static recommendationProducts = '/products';
    public static recommendationCreate = '/recommendation/add';
    //appointments
    public static appointmentList = '/appointment/list';
    public static unRegisterAppointmentList = '/appointment/unregister/list';
    public static appointmentCalendarList = '/appointment/calendar_list';
    public static appointment = '/appointment';

    public static appointmentProducts = '/appointment/products';
    public static appointmentCreate = '/appointment/create';
    public static unregisterAppointmentCreate = '/appointment/unregister/create';

    //analytics
    public static userAnalyticsList = '/analytic/user/list';
    public static productAnalyticsList = '/analytic/product/list';
    public static userAnalytic = '/analytic/user/list';
    public static overallUserAnalytic = 'analytic/user/list';
    public static productAnalytic = '/analytic/product/list';
    public static overallProductAnalytic = 'analytic/product/list';
    public static serviceAnalytic = '/analytic/service/list';
    public static overallServiceAnalytic = 'analytic/service/list';
    public static overallAppointmentAnalytic = 'analytic/appointment/list';
    public static newUser = 'new_user';

    //daily words of wisdom
    public static dailyWordsWisdomList = 'dailyWords/list';
    public static createQuote = 'dailyWords/createDailyWords';
    public static editQuote = 'dailywords/'
    public static quoteDetailsById = 'dailywords/quoteById/';

    // Overall Ingredients 
    public static ingredientList = 'ingredient/list'
    public static createIngredient = 'ingredient/createIngredient'
    public static getIngredient = 'ingredient/ingredientById'
    public static ingredient = 'ingredient/'

    //conversations
    public static chatUserList = '/chat/user/list';

    //reward
    public static createReward = '/reward/create'
    public static rewardList = '/reward/list';
    public static reward = '/reward'

    //promotional messages
    public static promotionalMessageList = '/notification/list';

    public static unLinkedClientsList = 'client/unlinked/list';
    public static unLinkedClientInfo = "client/unlinkedClient/"

    public static AdminSalonMenu: MenuList[] = [
        { name: 'Salon Information', routerLink: '/details' },
        { name: 'Clients', routerLink: '/clients' },
        { name: 'Services', routerLink: '/services' },
        { name: 'Providers', routerLink: '/providers' },
        { name: 'Brands', routerLink: '/brands' },
        { name: 'Appointments', routerLink: '/appointments' },
        { name: 'Recommendations', routerLink: '/recommendations' },
        { name: 'Conversations', routerLink: '/conversations' },
        // { name: 'Rewards', routerLink: '/rewards' },
        { name: 'Analytics', routerLink: '/analytics' },
        // { name: 'Unlinked Clients', routerLink: '/unlinkedClients' },
        { name: 'Notification Messages', routerLink: '/promotional-messages' },
        { name: 'Invite', routerLink: '/invite-users/list' }

    ]
    public static SuperAdminSalonMenu: MenuList[] = [
        { name: 'Details', routerLink: '/details' },
        { name: 'Clients', routerLink: '/clients' },
        { name: 'Services', routerLink: '/services' },
        { name: 'Providers', routerLink: '/providers' },
        { name: 'Manage Brands', routerLink: '/brands' },
        { name: 'Appointments', routerLink: '/appointments' },
        { name: 'Recommendations', routerLink: '/recommendations' },
        { name: 'Conversations', routerLink: '/conversations' },
        // { name: 'Rewards', routerLink: '/rewards' },
        { name: 'Analytics', routerLink: '/analytics' },
        // { name: 'Unlinked Clients', routerLink: '/unlinkedClients' },
        { name: 'Notification Management', routerLink: '/promotional-messages' },
        { name: 'Invite', routerLink: '/invite-users/list' }
    ];
    public static ProviderMenu: MenuList[] = [
        { name: 'Clients', routerLink: '/clients' },
        { name: 'Appointments', routerLink: '/appointments' },
        { name: 'Recommendations', routerLink: '/recommendations' },
        { name: 'Conversations', routerLink: '/conversations' },
        { name: 'Invite', routerLink: '/invite-users/list' }

    ]
    public static HeaderMenu: MenuList[] = [
        { name: 'Studios', routerLink: '/home/salons' },
        { name: 'Brands', routerLink: '/home/brands' },
        { name: 'Over View Analytics', routerLink: '/home/over-view-analytics' },
        { name: 'Clients', routerLink: '/home/allClients' },
        { name: 'Daily Words of Wisdom', routerLink: '/home/daily-words-of-wisdom' },
        { name: 'Ingredients', routerLink: '/home/ingredients' },
    ]
    public static Statuses: Status[] = [
        { value: 'Active', id: 'Active' },
        { value: 'Inactive', id: 'Inactive' }
    ];
    public static Time: Status[] = [
        { value: '12:00 AM', id: '1' },
        { value: '1:00 AM', id: '2' },
        { value: '2:00 AM', id: '3' },
        { value: '3:00 AM', id: '4' },
        { value: '4:00 AM', id: '5' },
        { value: '5:00 AM', id: '6' },
        { value: '6:00 AM', id: '7' },
        { value: '7:00 AM', id: '8' },
        { value: '8:00 AM', id: '9' },
        { value: '9:00 AM', id: '10' },
        { value: '10:00 AM', id: '11' },
        { value: '11:00 AM', id: '12' },
        { value: '12:00 PM', id: '13' },
        { value: '1:00 PM', id: '14' },
        { value: '2:00 PM', id: '15' },
        { value: '3:00 PM', id: '16' },
        { value: '4:00 PM', id: '17' },
        { value: '5:00 PM', id: '18' },
        { value: '6:00 PM', id: '19' },
        { value: '7:00 PM', id: '20' },
        { value: '8:00 PM', id: '21' },
        { value: '9:00 PM', id: '22' },
        { value: '10:00 PM', id: '23' },
        { value: '11:00 PM', id: '24' },
    ];
    public static toTime: Status[] = [
        { value: '12:00 AM', id: '1' },
        { value: '1:00 AM', id: '2' },
        { value: '2:00 AM', id: '3' },
        { value: '3:00 AM', id: '4' },
        { value: '4:00 AM', id: '5' },
        { value: '5:00 AM', id: '6' },
        { value: '6:00 AM', id: '7' },
        { value: '7:00 AM', id: '8' },
        { value: '8:00 AM', id: '9' },
        { value: '9:00 AM', id: '10' },
        { value: '10:00 AM', id: '11' },
        { value: '11:00 AM', id: '12' },
        { value: '12:00 PM', id: '13' },
        { value: '1:00 PM', id: '14' },
        { value: '2:00 PM', id: '15' },
        { value: '3:00 PM', id: '16' },
        { value: '4:00 PM', id: '17' },
        { value: '5:00 PM', id: '18' },
        { value: '6:00 PM', id: '19' },
        { value: '7:00 PM', id: '20' },
        { value: '8:00 PM', id: '21' },
        { value: '9:00 PM', id: '22' },
        { value: '10:00 PM', id: '23' },
        { value: '11:00 PM', id: '24' },
    ];
    public static Days: Status[] = [
        { value: 'Monday', id: 'Monday' },
        { value: 'Tuesday', id: 'Tuesday' },
        { value: 'Wednesday', id: 'Wednesday' },
        { value: 'Thursday', id: 'Thursday' },
        { value: 'Friday', id: 'Friday' },
        { value: 'Saturday', id: 'Saturday' },
        { value: 'Sunday', id: 'Sunday' },
    ];
    public static salonDays: Status[] = [
        { value: '0', id: 'Sunday' },
        { value: '1', id: 'Monday' },
        { value: '2', id: 'Tuesday' },
        { value: '3', id: 'Wednesday' },
        { value: '4', id: 'Thursday' },
        { value: '5', id: 'Friday' },
        { value: '6', id: 'Saturday' },
    ];

    public static Hours: Status[] = [
        { value: '1:00', id: '1' },
        { value: '2:00', id: '2' },
        { value: '3:00', id: '3' },
        { value: '4:00', id: '4' },
        { value: '5:00', id: '5' },
        { value: '6:00', id: '6' },
        { value: '7:00', id: '7' },
        { value: '8:00', id: '8' },
        { value: '9:00', id: '9' },
        { value: '10:00', id: '10' },
        { value: '11:00', id: '11' },
        { value: '12:00', id: '12' },
        { value: '13:00', id: '13' },
        { value: '14:00', id: '14' },
        { value: '15:00', id: '15' },
        { value: '16:00', id: '16' },
        { value: '17:00', id: '17' },
        { value: '18:00', id: '18' },
        { value: '19:00', id: '19' },
        { value: '20:00', id: '20' },
        { value: '21:00', id: '21' },
        { value: '22:00', id: '22' },
        { value: '23:00', id: '23' },
        { value: '24:00', id: '24' },
    ];
    public static weekDays: DaysStatus[] = [
        { value: '01', id: 1 },
        { value: '02', id: 2 },
        { value: '03', id: 3 },
        { value: '04', id: 4 },
        { value: '05', id: 5 },
        { value: '06', id: 6 },
        { value: '07', id: 7 },
    ];

    public static appointmentStatus: appointmentStatus[] = [
        { id: 'Cancelled', name: 'Cancelled' },
        { id: 'Confirmed', name: 'Confirmed' },
        { id: 'Fulfilled', name: 'Fulfilled' },
        { id: 'Pending', name: 'Pending' },
    ];

    public static ritualData: RitualArray[] = [
        { id: 'MR', value: 'Morning Ritual', isChecked: false },
        { id: 'ER', value: 'Evening Ritual', isChecked: false },
    ];

}
