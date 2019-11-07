export const objectFilter = (object: any, filter: Function) => {
  const result: any = {}

  for (const key in object) 
      if (object.hasOwnProperty(key) && !filter(object[key])) 
          result[key] = object[key]  

  return result
}