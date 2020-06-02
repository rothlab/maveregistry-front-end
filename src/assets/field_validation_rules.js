import { extend } from 'vee-validate';
import { required, email, alpha, alpha_dash, regex, alpha_num, oneOf, max } from 'vee-validate/dist/rules';

// Vee-validate
extend('required', {
  ...required,
  message: 'This field is required. '
});
extend('alpha', {
  ...alpha,
  message: 'Only use alphabetic characters.'
});
extend('alpha_num', {
  ...alpha_num,
  message: 'Only use alphabetic characters and numbers.'
});
extend('alpha_dash', {
  ...alpha_dash,
  message: 'Only use alphabetic characters, numbers, dashes or underscores.'
});
extend('email', {
  ...email,
  message: 'Please provide a valid email.'
});
extend('regex', {
  ...regex,
});
extend('max', {
  ...max,
  message: 'This field is too long.'
});
extend('oneOf', {
  ...oneOf,
  message: 'Please select one from the list.'
});
extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match.'
});
extend('password_strength', {
  params: ['target', 'score'],
  validate(value, { target, score }) {
    return score >= target
  },
  message: "Weak password. "
});
extend('end_date', {
  params: ['target'],
  validate(value, { target }) {
    return value > target
  },
  message: 'End Date must be later than the Start Date.'
})
