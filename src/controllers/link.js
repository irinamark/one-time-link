import { BadRequest } from 'http-errors';
import {
  Link,
} from '../models';
import { ErrorMessages } from '../constants';
import { config } from '../config';
import { LinkStatuses } from '../constants/linkStatuses';

/**
 *
 * @param {string} value
 * @returns {Promise<string>}
 */
async function createLink({ value }) {
  const link = await Link.findOne({ where: { value, status: LinkStatuses.active } });
  if (link) throw new BadRequest(ErrorMessages.link_already_exist);

  const createdLink = await Link.create({ value });
  return `${config.API_URL}/links/${createdLink.id}`;
}

/**
 *
 * @param {string} linkId
 * @returns {Promise}
 */
async function getLinkById(linkId) {
  const link = await Link.findOneOrFail({ id: linkId });
  if (link.status === LinkStatuses.used) throw new BadRequest(ErrorMessages.link_already_used);
  await link.update({ status: LinkStatuses.used });
  return link.publish(['compact']);
}

export {
  createLink, getLinkById,
};
