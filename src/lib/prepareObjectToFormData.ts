export const prepareObjectToFormData = (object: Record<string, unknown>) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (
            typeof item === "object" &&
            item !== null &&
            !(item instanceof Blob)
          ) {
            // Handle array of objects with indexed keys
            Object.entries(item).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== null && nestedValue !== undefined) {
                formData.append(
                  `${key}[${index}][${nestedKey}]`,
                  String(nestedValue),
                );
              }
            });
          } else {
            formData.append(`${key}[]`, item);
          }
        });
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else if (typeof value === "number") {
        formData.append(key, String(value));
      } else if (typeof value === "object" && !(value instanceof Blob)) {
        // Handle nested objects with dot notation or nested keys
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== null && nestedValue !== undefined) {
            formData.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        });
      } else {
        formData.append(key, value as string | Blob);
      }
    }
  });
  return formData;
};
