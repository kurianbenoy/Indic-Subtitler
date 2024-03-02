import { LANGUAGES_PER_MODEL } from "./constants";

export const formatLanguagesForDropdownOptions = (modelName) => {
  const avilableLanguages = LANGUAGES_PER_MODEL.find(
    (item) => item.model === modelName
  )?.languages;

  return avilableLanguages;
};
