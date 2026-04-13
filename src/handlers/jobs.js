import { jsonResponse } from '../utils/response.js';
import { withAccount, safeParseJson } from '../utils/helpers.js';
import { getJobs, createJob } from '../services/renderApi.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Handle get jobs
 */
export async function handleGetJobs(request, match, env) {
  const [, accountId, serviceId] = match;

  return withAccount(
    env,
    accountId,
    { notFoundMessage: '账户不存在', errorLogLabel: '获取 Jobs 失败:', errorResponseMessage: null },
    async (account) => {
      const result = await getJobs(account, serviceId);
      return jsonResponse(result);
    }
  );
}

/**
 * Handle create job
 */
export async function handleCreateJob(request, match, env) {
  const [, accountId, serviceId] = match;

  try {
    const { data, error: parseError } = await safeParseJson(request);
    if (parseError) {
      return jsonResponse({ error: parseError }, HTTP_STATUS.BAD_REQUEST);
    }

    const { startCommand } = data || {};
    if (!startCommand) {
      return jsonResponse({ error: 'Missing startCommand' }, HTTP_STATUS.BAD_REQUEST);
    }

    return withAccount(
      env,
      accountId,
      { notFoundMessage: '账户不存在', errorLogLabel: '创建 Job 失败:', errorResponseMessage: null },
      async (account) => {
        const result = await createJob(account, serviceId, startCommand);
        return jsonResponse({ success: true, data: result });
      }
    );
  } catch (error) {
    console.error('Create Job Error:', error);
    return jsonResponse({ error: 'Failed to create job' }, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
