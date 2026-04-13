import { jsonResponse } from '../utils/response.js';
import { withAccount, safeParseJson } from '../utils/helpers.js';
import { getCustomDomains, addCustomDomain, deleteCustomDomain } from '../services/renderApi.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Handle get custom domains
 */
export async function handleGetCustomDomains(request, match, env) {
  const [, accountId, serviceId] = match;

  return withAccount(
    env,
    accountId,
    { notFoundMessage: '账户不存在', errorLogLabel: '获取 Domains 失败:', errorResponseMessage: null },
    async (account) => {
      const result = await getCustomDomains(account, serviceId);
      return jsonResponse(result);
    }
  );
}

/**
 * Handle add custom domain
 */
export async function handleAddCustomDomain(request, match, env) {
  const [, accountId, serviceId] = match;

  try {
    const { data, error: parseError } = await safeParseJson(request);
    if (parseError) {
      return jsonResponse({ error: parseError }, HTTP_STATUS.BAD_REQUEST);
    }

    const { name } = data || {};
    if (!name) {
      return jsonResponse({ error: 'Missing domain name' }, HTTP_STATUS.BAD_REQUEST);
    }

    return withAccount(
      env,
      accountId,
      { notFoundMessage: '账户不存在', errorLogLabel: '添加 Domain 失败:', errorResponseMessage: null },
      async (account) => {
        const result = await addCustomDomain(account, serviceId, name);
        return jsonResponse({ success: true, data: result });
      }
    );
  } catch (error) {
    console.error('Add Domain Error:', error);
    return jsonResponse({ error: 'Failed to add domain' }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Handle delete custom domain
 */
export async function handleDeleteCustomDomain(request, match, env) {
  const [, accountId, serviceId, domainId] = match;

  return withAccount(
    env,
    accountId,
    { notFoundMessage: '账户不存在', errorLogLabel: '删除 Domain 失败:', errorResponseMessage: null },
    async (account) => {
      await deleteCustomDomain(account, serviceId, domainId);
      return jsonResponse({ success: true });
    }
  );
}
