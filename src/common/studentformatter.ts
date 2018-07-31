import { IStudent } from './interface';
export function studentFormatter(student: IStudent) {
    let formattedStudent = <IStudent>{};
    for (var prop in student) {
        switch (prop) {
            case 'firstName':
                formattedStudent.firstName = student.firstName.toLowerCase();
                break;
            case 'lastName':
                formattedStudent.lastName = student.lastName.toLowerCase();
                break;
            case 'initial':
                formattedStudent.initial = student.initial.toLowerCase();
                break;
            case 'address':
                formattedStudent.address = student.address.toLowerCase();
                break;
            case 'town':
                formattedStudent.town = student.town.toLowerCase();
                break;
            default:
                formattedStudent = {
                    ...student,
                    ...formattedStudent
                }
        }
    }
    return formattedStudent;
}