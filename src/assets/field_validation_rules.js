import { extend } from 'vee-validate';
import { required, email, alpha_dash } from 'vee-validate/dist/rules';

// Vee-validate
extend('required', {
  ...required,
  message: 'This field is required. '
});
extend('alpha_dash', {
  ...alpha_dash,
  message: 'Only use alphabetic characters, numbers, dashes or underscores. '
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
