export interface IStudent {
firstName: string;
initial?: string;
lastName: string;
id: string;
address: string;
phoneNumber?:string[];
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
emergencyContactPhoneNumber:string[];
}

export interface IAssistance {
date: string;
attendance: boolean;
studentId: number;
}
