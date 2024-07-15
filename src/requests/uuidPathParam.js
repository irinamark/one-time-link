import * as yup from 'yup';

export const UuidPathParam = yup.object().shape({
  id: yup.string().uuid().required(),
});
