const activation = {
  subject: 'Activate user',
  html: data => `
Your activation link: <a href="${data.link}" target="_blank" />Activate</a>
`,
};

const resetPassword = {
  subject: 'Reset password',
  html: data => `
Your reset password link: <a href="${data.link}" target="_blank" />Reset password</a>
`,
};

const userTemplate = {
  activation,
  resetPassword,
};

export {
  userTemplate,
};
