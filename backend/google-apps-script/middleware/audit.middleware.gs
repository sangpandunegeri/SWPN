/**
 * SPWN Apps 2.0 - Audit Logging Middleware
 * Location: backend/google-apps-script/middleware/audit.middleware.gs
 * ------------------------------------------------------------------
 * Tanggung Jawab:
 * Mencatat log audit untuk aksi penting dan mutasi data sensitif:
 * - content.publish
 * - member.update
 * - member.deactivate
 * - commerce.updateOrder
 * 
 * Atribut Log Audit:
 * { actor, action, target, timestamp, client, result, details }
 */

var AuditMiddleware = (function() {
  var AUDIT_SPREADSHEET_KEY = 'DATABASE_AUDIT_SPREADSHEET_ID';
  var AUDIT_ACTIONS = [
    'content.publish',
    'member.update',
    'member.deactivate',
    'commerce.updateOrder',
    'auth.login',
    'tourism.createDestination'
  ];

  /**
   * Mengecek apakah action saat ini memerlukan pencatatan audit trail.
   * 
   * @param {string} action 
   * @returns {boolean}
   */
  function shouldAudit(action) {
    return AUDIT_ACTIONS.indexOf(action) !== -1;
  }

  /**
   * Mencatat log audit ke console / cache / spreadsheet async.
   * 
   * @param {Object} context - Objek RequestContext
   * @param {string} target - Identifier objek target (ID Anggota, ID Artikel, No Invoice, dll)
   * @param {string} result - 'SUCCESS' | 'FAILED'
   * @param {Object} [details] - Informasi pelengkap
   */
  function log(context, target, result, details) {
    context = context || {};
    var action = context.action || 'UNKNOWN';

    var actorId = (context.user && (context.user.userId || context.user.id || context.user.no_kta)) || 'ANONYMOUS';
    var actorRole = context.role || 'PUBLIC';

    var auditEntry = {
      id: 'AUD-' + new Date().getTime().toString(36) + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      action: action,
      actor: actorId,
      role: actorRole,
      target: target || '',
      ip: (context.client && context.client.ip) || 'unknown',
      userAgent: (context.client && context.client.userAgent) || 'unknown',
      result: result || 'SUCCESS',
      details: details ? JSON.stringify(details) : ''
    };

    // 1. Output ke standard Apps Script Logger
    Logger.log('[AUDIT TRAIL] ' + JSON.stringify(auditEntry));

    // 2. Buffer audit ke Cache / Script Property jika diperlukan untuk batch write
    try {
      var cache = CacheService.getScriptCache();
      var key = 'AUDIT_LATEST_' + auditEntry.id;
      cache.put(key, JSON.stringify(auditEntry), 3600);
    } catch (e) {
      // Abaikan bila cache penuh
    }

    return auditEntry;
  }

  return {
    shouldAudit: shouldAudit,
    log: log
  };
})();
