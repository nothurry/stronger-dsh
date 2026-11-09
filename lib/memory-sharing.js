export class MemorySharing {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.deleted = () => [];
  }

  origin(id, initialHeader) {
    const seen = new Set();
    for (let depth = 0; id && depth < 12; depth++) {
      if (seen.has(id)) break;
      seen.add(id);
      if (Object.hasOwn(this.config().sessions, id)) return { id, channel: 'wechat' };
      const header = depth === 0 && initialHeader
        ? initialHeader.header ?? initialHeader
        : this.ctx.get('sessions')?.get(id)?.header;
      if (header?.origin !== 'subagent') return { id, channel: 'desktop' };
      id = header.parentSession;
    }
    return { id: null, channel: 'isolated' };
  }

  sessionsAllowed(candidateId, currentId, header) {
    if (this.deleted().includes(candidateId)) return false;
    const candidate = this.origin(candidateId, header);
    const current = this.origin(currentId);
    if ([candidate.channel, current.channel].includes('isolated')) return false;
    if (this.deleted().includes(candidate.id) || this.deleted().includes(current.id)) return false;
    const config = this.config();
    if ([candidate, current].some(origin => origin.channel === 'wechat'
      && !config.allowedCwds.includes(config.sessions[origin.id]))) return false;
    if (candidate.channel === current.channel) return true;
    if (!config.shareMemory) return false;
    const desktop = candidate.channel === 'desktop' ? candidate : current;
    return !this.deleted().includes(desktop.id)
      && (config.memorySessionIds === null || config.memorySessionIds.includes(desktop.id));
  }

  recordAllowed(row, currentId, channel) {
    const config = this.config();
    if (!config.shareMemory || channel === 'isolated') return false;
    if (config.memorySessionIds === null) return true;
    // Old unlabelled records cannot safely be assigned to a selected conversation.
    if (!row.sourceSessionId || !config.allowedCwds.includes(row.cwd)) return false;
    if (this.origin(row.sourceSessionId).channel !== (row.channel ?? 'desktop')) return false;
    return this.sessionsAllowed(row.sourceSessionId, currentId);
  }

  async candidates(allowedCwds, signal, { includeWechat = false } = {}) {
    const query = this.ctx.get('sessionQuery');
    if (!query?.filterSessions) throw Error('宿主尚未提供会话列表，请稍后重试');
    const rows = allowedCwds.length
      ? await query.filterSessions([{ kind: 'cwd', values: allowedCwds }], signal)
      : [];
    const ids = new Set();
    const items = [];
    for (const row of rows.slice(0, 8192)) {
      const header = row.header ?? row;
      const id = header.id;
      if (typeof id !== 'string' || !id || id.length > 160 || ids.has(id)
        || header.origin === 'subagent' || !includeWechat && Object.hasOwn(this.config().sessions, id)
        || this.deleted().includes(id) || !allowedCwds.includes(header.cwd)) continue;
      ids.add(id);
      items.push({ id, channel: Object.hasOwn(this.config().sessions, id) ? 'wechat' : 'desktop', title: String(row.title ?? header.title ?? row.name ?? id).slice(0, 120), cwd: header.cwd });
    }
    return { items, truncated: rows.length > 8192 };
  }

  async choices({ offset = 0, limit = 40, signal } = {}) {
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > 8192) throw Error('无效会话页码');
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 40) throw Error('无效会话页大小');
    const config = this.config();
    const permissionKey = JSON.stringify(config.allowedCwds);
    const result = await this.candidates(config.allowedCwds, signal);
    const items = result.items.slice(offset, offset + limit);
    const query = this.ctx.get('sessionQuery');
    if (items.length && query.readTitleSnapshots) {
      const titles = await query.readTitleSnapshots(items.map(row => row.id), signal);
      for (const title of titles) {
        if (title.status !== 'fulfilled') continue;
        const row = items.find(item => item.id === title.sessionId);
        const header = title.value.session;
        if (row && header?.id === row.id && header.cwd === row.cwd && typeof title.value.title?.title === 'string') {
          row.title = title.value.title.title.slice(0, 120);
        }
      }
    }
    if (permissionKey !== JSON.stringify(this.config().allowedCwds)) throw Error('工作区权限已变更，请重新读取会话');
    return { items: items.filter(row => !this.deleted().includes(row.id)), next: offset + limit < result.items.length ? offset + limit : null, total: result.items.length, truncated: result.truncated };
  }

  async validate(ids, allowedCwds, checkAvailability = true) {
    if (ids === null) return null;
    if (!Array.isArray(ids) || ids.length > 512
      || ids.some(id => typeof id !== 'string' || !id || id.length > 160 || /[\s,\0]/.test(id))) {
      throw Error('请选择有效的记忆互通会话');
    }
    const unique = [...new Set(ids)];
    if (!unique.length || !checkAvailability) return unique;
    const available = new Set((await this.candidates(allowedCwds)).items.map(row => row.id));
    const previous = this.config().memorySessionIds ?? [];
    if (unique.some(id => !available.has(id) && !previous.includes(id))) throw Error('所选会话已不可用或不在允许的工作区内，请重新选择');
    // Removing a workspace also revokes its previously selected conversations.
    return unique.filter(id => available.has(id));
  }
}
