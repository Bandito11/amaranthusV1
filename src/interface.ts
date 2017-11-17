export interface IStudent {
firstName: string;
initial?: string;
lastName: string;
id: string;
address: string;
phoneNumber?:number[];
town:string;
state:string;
picture:string;
gender:string;
fatherFirstName:string;
fatherLastName:string;
motherFirstName:string;
motherLastName:string;
emergencyContactName?:string;
emergencyContactPhoneNumber:number[];
}

export interface IAssistance {
date: string;
absennce: boolean;
studentId: number;
}
