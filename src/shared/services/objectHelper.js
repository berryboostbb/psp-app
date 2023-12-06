export function arraysAreEqual(arr1, arr2) {
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  for (let i = 0; i < arr1?.length; i++) {
    if (!objectIsEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
}

function objectIsEqual(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys?.length !== obj2Keys?.length) {
    return false;
  }

  for (let i = 0; i < obj1Keys?.length; i++) {
    const key = obj1Keys[i];

    if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
      if (!objectIsEqual(obj1[key], obj2[key])) {
        return false;
      }
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
