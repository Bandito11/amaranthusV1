export function handleError(error: any) {
  if(typeof error == 'string')  console.error(error)
  else{
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        console.error(error[key]);
        
      }
    }
  }
}