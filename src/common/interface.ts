export interface IStudent {
    firstName: string;
    initial?: string;
    lastName: string;
    id: string;
    address: string;
    phoneNumber?: string;
    town: string;
    state: string;
    picture: string;
    gender: string;
    fatherFirstName: string;
    fatherLastName: string;
    motherFirstName: string;
    motherLastName: string;
    emergencyContactName: string;
    emergencyRelationship: string;
    emergencyContactPhoneNumber: string;
    isActive: boolean;
    class:string
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
    percent?:number;
}

export interface Calendar {
    weekDay?: number,
    day: number,
    month: number,
    year: number
}