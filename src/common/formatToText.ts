import { IStudent } from "./interface";

export function trimText(opts: IStudent) {
    let student = {
        ...opts,
        firstName: opts.firstName.trim(),
        lastName: opts.lastName.trim(),
        id: opts.id.trim()
    }
    if (opts.initial != '' || null || undefined) {
        student = {
            ...student,
            initial: opts.initial.trim(),
            address: opts.address.trim(),
            phoneNumber: opts.phoneNumber.trim(),
            town: opts.town.trim(),
            state: opts.state.trim(),
            fatherName: opts.fatherName.trim(),
            motherName: opts.motherName.trim(),
            emergencyContactName: opts.emergencyContactName.trim(),
            emergencyRelationship: opts.emergencyRelationship.trim(),
            emergencyContactPhoneNumber: opts.emergencyContactPhoneNumber.trim(),
            class: opts.class.trim()
        }
    }
    return student;
}

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

export function formatStudent(opts: IStudent) {
    const firstName = opts.firstName.split('')[0].toUpperCase() + opts.firstName.slice(1, opts.firstName.length);
    const lastName = opts.lastName.split('')[0].toUpperCase() + opts.lastName.slice(1, opts.lastName.length)
    let student = {
        ...opts,
        firstName: firstName,
        lastName: lastName
    };
    if (opts.initial) {
        const initial = opts.initial.split('')[0].toUpperCase() + opts.initial.slice(1, opts.initial.length)
        student = {
            ...student,
            initial: initial
        }
        return student;
    }
    else return student;
}