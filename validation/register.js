const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.birthday = !isEmpty(data.birthday) ? data.birthday : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'El campo de nombre es obligatorio';
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'El nombre debe tener entre 2 y 30 caracteres';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'El campo de correo electrónico es obligatorio';
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'El correo electrónico es invalido';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'El campo de contraseña es obligatorio';
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (Validator.isEmpty(data.password2) && !Validator.isEmpty(data.password)) {
    errors.password2 = 'El campo Confirmar contraseña es obligatorio';
  } else if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Las contraseñas deben coincidir';
  }

  if (Validator.isEmpty(data.birthday)) {
    errors.birthday = "El campo de cumpleaños es obligatorio";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "El campo del número de teléfono es obligatorio";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
