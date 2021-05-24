// Расширение старого обьекта и добавление нового
const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export default updateObject;
