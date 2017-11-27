export const STUDENTS = {
  "success": true,
  "error": null,
  "data": [
    {
      "firstName": "Esteban",
      "lastName": "Morales Morales",
      "id": "L1234",
      "motherFirstName": "Rosa",
      "motherLastName": "Morales Bonilla",
      "fatherFirstName": "Esteban",
      "fatherLastName": "Morales Gonzalez",
      "address": "123 Bda. Marin",
      "town": "Arroyo",
      "state": "PR",
      "gender": "male",
      "picture": "./assets/profilePics/defaultMale.jpg",
      "emergencyContactName": "Matt Murdock",
      "emergencyRelationship": "Friend",
      "emergencyContactPhoneNumber": "555-555-5555",
      "isActive": true
    },
    {
      "firstName": "Bill",
      "lastName": "Gates",
      "id": "L4321",
      "phoneNumber": "555-555-5555",
      "motherFirstName": "Mary",
      "motherLastName": "Gates",
      "fatherFirstName": "William",
      "fatherLastName": "Gates",
      "address": "123 Main Street",
      "town": "Redmond",
      "state": "PR",
      "gender": "male",
      "picture": "./assets/profilePics/defaultMale.jpg",
      "emergencyContactName": "Madeline Gates",
      "emergencyRelationship": "Wife",
      "emergencyContactPhoneNumber": "555-555-5555",
      "isActive": true
    },
    {
      "firstName": "Elon",
      "lastName": "Musk",
      "id": "L3214",
      "motherFirstName": "Rose",
      "motherLastName": "Tesla",
      "fatherFirstName": "Nikolaz",
      "fatherLastName": "Tesla",
      "address": "123 Germany",
      "town": "Germantown",
      "state": "GE",
      "gender": "male",
      "picture": "./assets/profilePics/defaultUndisclosed.jpg",
      "emergencyContactName": "Tony Stark",
      "emergencyRelationship": "Friend",
      "emergencyContactPhoneNumber": "555-555-5555",
      "isActive": true
    },
    {
      "firstName": "Stephanie",
      "lastName": "Hurlzburt",
      "id": "L4314",
      "phoneNumber": "555-555-5555",
      "motherFirstName": "Raeka",
      "motherLastName": "Hurlzburt",
      "fatherFirstName": "Bob",
      "fatherLastName": "Hurlzburt",
      "address": "123 Downtown",
      "town": "San Francisco",
      "state": "California",
      "gender": "female",
      "picture": "./assets/profilePics/defaultFemale.jpg",
      "emergencyContactName": "Robert Burt",
      "emergencyRelationship": "Boyfriend",
      "emergencyContactPhoneNumber": "555-555-5555",
      "isActive": true
    }
  ]
}
export const RECORDS = {
  success: true,
  error: "null",
  data: [
    {
      id: "L1234",
      year: 2017,
      month: 11,
      day: 22,
      attendance: true,
      absence: false
    },
    {
      id: "L1234",
      year: 2017,
      month: 10,
      day: 24,
      attendance: true,
      absence: false
    },
    {
      id: "L1234",
      year: 2017,
      month: 11,
      day: 21,
      attendance: true,
      absence: false
    },
    {
      id: "L1234",
      year: 2017,
      month: 9,
      day: 26,
      attendance: true,
      absence: false
    },
    {
      id: "L4314",
      year: 2017,
      month: 11,
      day: 26,
      attendance: true,
      absence: false
    },
    {
      id: "L3214",
      year: 2017,
      month: 11,
      day: 26,
      attendance: true,
      absence: false
    },
    {
      id: "L3214",
      year: 2017,
      month: 6,
      day: 7,
      attendance: true,
      absence: false
    },
    {
      id: "L3214",
      year: 2017,
      month: 11,
      day: 1,
      attendance: false,
      absence: true
    },
    {
      id: "L3214",
      year: 2017,
      month: 8,
      day: 12,
      attendance: false,
      absence: true
    },
    {
      id: "L4321",
      year: 2017,
      month: 11,
      day: 16,
      attendance: false,
      absence: true
    },
    {
      id: "L4321",
      year: 2017,
      month: 11,
      day: 27,
      attendance: false,
      absence: true
    }
  ]
}

// export const RECORDS = {
//   success: true,
//   error: null,
//   data: {
//     "L4314": {
//       2018: {
//         11: {
//           1: {
//             attendance: false,
//             absence: true
//           },
//           2: {
//             attendance: false,
//             absence: true
//           },
//           3: {
//             attendance: false,
//             absence: true
//           },
//           4: {
//             attendance: true,
//             absence: false
//           },
//           5: {
//             attendance: true,
//             absence: false
//           },
//           6: {
//             attendance: false,
//             absence: true
//           },
//           7: {
//             attendance: true,
//             absence: false
//           },
//           8: {
//             attendance: true,
//             absence: false
//           },
//           9: {
//             attendance: true,
//             absence: false
//           },
//           10: {
//             attendance: true,
//             absence: false
//           },
//           11: {
//             attendance: true,
//             absence: false
//           },
//           12: {
//             attendance: true,
//             absence: false
//           },
//           13: {
//             attendance: true,
//             absence: false
//           },
//           14: {
//             attendance: true,
//             absence: false
//           },
//           15: {
//             attendance: true,
//             absence: false
//           },
//           16: {
//             attendance: true,
//             absence: false
//           },
//           17: {
//             attendance: true,
//             absence: false
//           },
//           18: {
//             attendance: true,
//             absence: false
//           },
//           19: {
//             attendance: true,
//             absence: false
//           },
//           20: {
//             attendance: false,
//             absence: true
//           },
//           21: {
//             attendance: false,
//             absence: true
//           },
//           22: {
//             attendance: false,
//             absence: true
//           }
//         }
//       }
//     },
//     "L1234": {
//       2017: {
//         11: {
//           1: {
//             attendance: true,
//             absence: false
//           },
//           2: {
//             attendance: true,
//             absence: false
//           },
//           3: {
//             attendance: true,
//             absence: false
//           },
//           4: {
//             attendance: true,
//             absence: false
//           },
//           5: {
//             attendance: true,
//             absence: false
//           },
//           6: {
//             attendance: false,
//             absence: true
//           },
//           7: {
//             attendance: true,
//             absence: false
//           },
//           8: {
//             attendance: true,
//             absence: false
//           },
//           9: {
//             attendance: true,
//             absence: false
//           },
//           10: {
//             attendance: true,
//             absence: false
//           },
//           11: {
//             attendance: true,
//             absence: false
//           },
//           12: {
//             attendance: true,
//             absence: false
//           },
//           13: {
//             attendance: true,
//             absence: false
//           },
//           14: {
//             attendance: true,
//             absence: false
//           },
//           15: {
//             attendance: true,
//             absence: false
//           },
//           16: {
//             attendance: true,
//             absence: false
//           },
//           17: {
//             attendance: true,
//             absence: false
//           },
//           18: {
//             attendance: true,
//             absence: false
//           },
//           19: {
//             attendance: true,
//             absence: false
//           },
//           20: {
//             attendance: false,
//             absence: true
//           },
//           21: {
//             attendance: false,
//             absence: true
//           },
//           22: {
//             attendance: false,
//             absence: true
//           },
//           25:
//           {
//             attendance: false, 
//             absence:true
//           }
//         }
//       }
//     },
//     "L4321": {
//       2017: {
//         11: {
//           1: {
//             attendance: true,
//             absence: false
//           },
//           2: {
//             attendance: false,
//             absence: true
//           },
//           3: {
//             attendance: true,
//             absence: false
//           },
//           4: {
//             attendance: true,
//             absence: false
//           },
//           5: {
//             attendance: true,
//             absence: false
//           },
//           6: {
//             attendance: false,
//             absence: true
//           },
//           7: {
//             attendance: true,
//             absence: false
//           },
//           8: {
//             attendance: true,
//             absence: false
//           },
//           9: {
//             attendance: true,
//             absence: false
//           },
//           10: {
//             attendance: true,
//             absence: false
//           },
//           11: {
//             attendance: true,
//             absence: false
//           },
//           12: {
//             attendance: true,
//             absence: false
//           },
//           13: {
//             attendance: true,
//             absence: false
//           },
//           14: {
//             attendance: true,
//             absence: false
//           },
//           15: {
//             attendance: true,
//             absence: false
//           },
//           16: {
//             attendance: true,
//             absence: false
//           },
//           17: {
//             attendance: true,
//             absence: false
//           },
//           18: {
//             attendance: true,
//             absence: false
//           },
//           19: {
//             attendance: true,
//             absence: false
//           },
//           20: {
//             attendance: false,
//             absence: true
//           },
//           21: {
//             attendance: false,
//             absence: true
//           },
//           22: {
//             attendance: false,
//             absence: true
//           }
//         }
//       }
//     }
//   }
// }
