import { uniqueId } from 'lodash';
import { getNamespace } from 'cls-hooked';

export const getRequestId = () => {
    const context_cs = 'logger_namespace';
    const ns = getNamespace(context_cs);
    if (!ns) {
        return uniqueId();
    }
    const reqId = ns!.get('requestId');
    return reqId;
};

export function getPageInfo(totalCount: number, limit?: number, skip?: number) {
    if (!skip) {
        skip = 0;
    }
    if (!limit) {
        limit = totalCount - skip;
    }
    return {
        hasNextPage: totalCount > skip + limit,
        hasPreviousPage: skip > 0,
        limit,
        skip,
        totalCount,
    };
}