import { monthsLabels } from './labels';
import { IStudent, IEvent } from "./interface";

export function trimEvent(event: IEvent) {
    const formattedEvent: IEvent = {
        ...event,
        name: event.name.trim()
    }
    return formattedEvent;
}

export function formatDate(date: string) {
    const year = date.slice(0, 4);
    const month = parseInt(date.slice(6, 7));
    const day = date.slice(9, 10);
    const formattedDate = `${monthsLabels[month - 1]} ${day}, ${year}`;
    return formattedDate;
}

export function trimText(opts: IStudent) {
    let student = {
        ...opts,
        firstName: opts.firstName.trim(),
        lastName: opts.lastName.trim(),
        id: opts.id.trim(),
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
    return student;
}

export function formatStudentName(opts: IStudent) {
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