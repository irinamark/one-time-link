import * as yup from 'yup';

export const CreateLinkRequest = yup.object().shape({
  value: yup.string().required(),
});
