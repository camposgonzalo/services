const Validator = require("jsonschema").Validator;

const formatErrors = (errors: Array<any>) => {
  let errorsFormatted = [];

  for (let index = 0; index < errors.length; index++) {
    const error = errors[index];

    errorsFormatted.push({
      message: error.stack,
    });
  }

  return errorsFormatted;
};

export class JsonValidator {
  static validate(data: Object, schema: Object) {
    const validator = new Validator();
    const validationResult = validator.validate(data, schema);

    return {
      valid: validationResult.valid,
      errors: formatErrors(validationResult.errors),
    };
  }
}
