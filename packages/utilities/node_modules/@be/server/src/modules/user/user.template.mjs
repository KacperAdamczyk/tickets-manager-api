const activation = {
  subject: 'Activate user',
  html: data => `
Your activation link: <a href="${data.link}" />Activate</a>
`,
};

const userTemplate = {
  activation,
};

export {
  userTemplate,
};
