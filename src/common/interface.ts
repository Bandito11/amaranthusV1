export interface IStudent {
firstName: string;
initial?: string;
lastName: string;
id: string;
address: string;
phoneNumber?:string;
town:string;
state:string;
picture:string;
gender:string;
fatherFirstName:string;
fatherLastName:string;
motherFirstName:string;
motherLastName:string;
emergencyContactName:string;
emergencyRelationship:string;
emergencyContactPhoneNumber:string;
isActive: boolean;
}

export interface IAssistance {
date: string;
attendance: boolean;
studentId: number;
}

export interface IResponse <T> {
    success: boolean;
    error: string;
    data: T[];
}