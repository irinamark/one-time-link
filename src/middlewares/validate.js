import { BadRequest } from 'http-errors';
import { ErrorMessages } from '../constants';

/**
 *
 * @param {Error} error
 * @returns {string}
 */
function getErrorMessage(error) {
  if (error.type === 'required') {
    return `${ErrorMessages.missing_required_field}:${error.path}`;
  }
  if (error.type === 'oneOf') {
    return `${ErrorMessages.invalid_enum_field}:${error.path}:${error.params.values}`;
  }
  return error.message;
}

/**
 *
 * @param {object} bodyValidationSchema
 * @param {object} additionalValidationSchemas
 */
export function validateRequest(
  bodyValidationSchema,
  additionalValidationSchemas = {},
) {
  return async (req, res, next) => {
    if (bodyValidationSchema) {
      // eslint-disable-next-line no-param-reassign
      additionalValidationSchemas.body = bodyValidationSchema;
    }

    const requestFieldsToValidate = Object.keys(additionalValidationSchemas);
    const validationErrors = [];

    const validatePromises = requestFieldsToValidate.map(async (requestField) => {
      const validationSchema = additionalValidationSchemas[requestField];
      const isValid = await validationSchema.validate(req[requestField]).catch((error) => {
        const message = getErrorMessage(error);
        validationErrors.push(message);
        return false;
      });
      if (!isValid) return;
      req[requestField] = validationSchema.cast(req[requestField], { stripUnknown: true });
    });

    await Promise.all(validatePromises);
    if (validationErrors.length === 0) {
      return next();
    }

    return next(new BadRequest(validationErrors.join('. ')));
  };
}
