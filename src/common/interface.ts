export interface IStudent {
    firstName: string;
    initial?: string;
    lastName: string;
    id: string;
    address: string;
    phoneNumber: string;
    town: string;
    state: string;
    picture: string;
    gender: string;
    fatherName: string;
    motherName: string;
    emergencyContactName: string;
    emergencyRelationship: string;
    emergencyContactPhoneNumber: string;
    isActive: boolean;
    class: string,
    fullName?: string
}

export interface IEvent {
    logo: string;
    name: string;
    startDate: string;
    endDate: string;
    members: {
        id: string,
        attendance: boolean;
        absence: boolean;
    }[];
}

export interface IStudentEvent {
    id: string,
    attendance: boolean;
    absence: boolean;
}

export interface IAssistance {
    date: string;
    attendance: boolean;
    studentId: number;
}

export interface IResponse<T> {
    success: boolean;
    error: string;
    data: T;
}

export interface ISimpleAlertOptions {
    title: string;
    subTitle: string;
    buttons?: string[];
}

export interface IRecord {
    id: string;
    attendance: boolean;
    absence: boolean;
    year: number;
    month: number;
    day: number;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    picture?: string;
    percent?: number;
}

export interface ICalendar {
    weekDay?: number,
    day: number,
    month: number,
    year: number
}

export interface productGet {
    productId: string;
    title: string;
    description: string;
    currency: string;
    price: any;
    priceAsDecimal: any;
}
export interface productBought {
    transactionId: string;
    receipt: string;
    signature: string;
    productType: string;
}
export interface productRestore {
    productId: string;
    state: string | number;
    transactionId: string;
    type: string;
    date: string;
    productType: string;
    receipt;
    signature: string;
}