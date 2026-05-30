const { validationResult, body } = require('express-validator');

// Run validation and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'mentor']).withMessage('Role must be student or mentor'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const checkEmailValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  validate,
];

const resendVerificationValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  validate,
];

const createPostValidation = [
  body('content').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Post content must be 1-2000 characters'),
  body('type').optional().isIn(['story', 'tip', 'opportunity', 'achievement', 'question']).withMessage('Invalid post type'),
  body('tags').optional().isArray({ max: 10 }).withMessage('Tags must be an array of up to 10 items'),
  body('tags.*').optional().isString().trim().isLength({ min: 1, max: 30 }).withMessage('Each tag must be 1-30 characters'),
  validate,
];

const addCommentValidation = [
  body('content').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters'),
  validate,
];

const createOrUpdateJobValidation = [
  body('company').optional().isString().trim().isLength({ min: 1, max: 120 }).withMessage('Company must be 1-120 characters'),
  body('title').optional().isString().trim().isLength({ min: 1, max: 140 }).withMessage('Title must be 1-140 characters'),
  body('location').optional().isString().trim().isLength({ max: 120 }).withMessage('Location too long'),
  body('type').optional().isIn(['full-time', 'part-time', 'internship', 'contract']).withMessage('Invalid job type'),
  body('description').optional().isString().trim().isLength({ min: 1, max: 4000 }).withMessage('Description must be 1-4000 characters'),
  body('requirements').optional().isArray({ max: 30 }).withMessage('Requirements must be an array of up to 30 items'),
  body('requirements.*').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('Each requirement must be 1-200 characters'),
  body('applicationUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).withMessage('Application URL must be a valid URL'),
  body('industry').optional().isString().trim().isLength({ max: 80 }).withMessage('Industry too long'),
  body('skills').optional().isArray({ max: 30 }).withMessage('Skills must be an array of up to 30 items'),
  body('skills.*').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('Each skill must be 1-50 characters'),
  validate,
];

const requestConnectionValidation = [
  body('mentorId').isMongoId().withMessage('Valid mentorId is required'),
  body('requestMessage').optional().isString().trim().isLength({ max: 500 }).withMessage('Request message too long'),
  validate,
];

const createOrUpdateWorkshopValidation = [
  body('title').optional().isString().trim().isLength({ min: 1, max: 150 }).withMessage('Title must be 1-150 characters'),
  body('description').optional().isString().trim().isLength({ min: 1, max: 5000 }).withMessage('Description must be 1-5000 characters'),
  body('type').optional().isIn(['live', 'recorded']).withMessage('Invalid workshop type'),
  body('category').optional().isString().trim().isLength({ max: 100 }).withMessage('Category too long'),
  body('scheduledAt').optional().isISO8601().withMessage('scheduledAt must be a valid ISO date'),
  body('durationMinutes').optional().isInt({ min: 5, max: 600 }).withMessage('durationMinutes must be 5-600'),
  body('meetingLink').optional({ values: 'falsy' }).isURL({ require_protocol: true }).withMessage('meetingLink must be a valid URL'),
  body('recordingUrl').optional({ values: 'falsy' }).isURL({ require_protocol: true }).withMessage('recordingUrl must be a valid URL'),
  body('maxCapacity').optional().isInt({ min: 1, max: 5000 }).withMessage('maxCapacity must be 1-5000'),
  body('tags').optional().isArray({ max: 20 }).withMessage('Tags must be an array of up to 20 items'),
  body('tags.*').optional().isString().trim().isLength({ min: 1, max: 40 }).withMessage('Each tag must be 1-40 characters'),
  body('isPaid').optional().isBoolean().withMessage('isPaid must be boolean'),
  body('price').optional().isFloat({ min: 0, max: 1000000 }).withMessage('price must be a non-negative number'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  checkEmailValidation,
  resendVerificationValidation,
  createPostValidation,
  addCommentValidation,
  createOrUpdateJobValidation,
  requestConnectionValidation,
  createOrUpdateWorkshopValidation,
};
