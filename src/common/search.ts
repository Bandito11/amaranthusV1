import { IStudent } from "./models";

/**
 * 
 * @param {string, IStudent[]} opts 
 */
export function filterStudentsList(opts: { students: IStudent[], query: string }) {
    let fullName: string;
    const newQuery = opts.students.filter(student => {
        fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        if (
            student.id == opts.query ||
            student.firstName.toLowerCase().includes(opts.query.toLowerCase()) ||
            student.lastName.toLowerCase().includes(opts.query.toLowerCase()) ||
            fullName == opts.query.toLowerCase()) {
            return student;
        }
    });
    return newQuery;
}

export function sortStudentsName(students: IStudent[]) {
    return [
        ...students.sort((a, b) => {
            if (a.firstName.toLowerCase() < b.firstName.toLowerCase())
                return -1;
            if (a.firstName.toLowerCase() > b.firstName.toLowerCase())
                return 1;
            return 0;
        })
    ];
}

export function sortStudentsbyId(students: IStudent[]) {
    return [
        ...students.sort((a, b) => {
            if (a.id.slice(2, a.id.length) < b.id.slice(2, b.id.length)) return -1;
            if (a.id.slice(2, a.id.length) > b.id.slice(2, b.id.length)) return 1;
            return 0;
        })
    ];
}
