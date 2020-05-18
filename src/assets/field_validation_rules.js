import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Vee-validate
extend('required', {
  ...required,
  message: 'This field is required. '
});
extend('email', {
  ...email,
  message: 'Please provide a valid email. '
});
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match. '
});
extend('password_strength', {
  params: ['target', 'score'],
  validate(value, { target, score }) {
    return score >= target
  },
  message: "Weak password. "
});
