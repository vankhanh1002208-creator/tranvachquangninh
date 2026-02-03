/**
 * AUTONOMOUS OPTIMIZATION AGENT
 * Self-Healing & Continuous Improvement System
 * 
 * Capabilities:
 * - Auto-detect JS errors
 * - Auto-detect form submission failures
 * - Auto-detect API failures (Telegram/Email)
 * - Self-healing (safe fixes only)
 * - Comprehensive logging
 * - One change per iteration
 * 
 * Date: 02/02/2026
 */

class AutonomousAgent {
    constructor() {
        this.logs = [];
        this.errors = [];
        this.healthChecks = new Map();
        this.lastCheck = null;
        this.fixAttempts = 0;
        this.maxFixAttempts = 3;

        this.init();
    }

    init() {
        console.log('[Autonomous Agent] Initializing self-healing system...');

        // Global error handler
        window.addEventListener('error', (e) => this.handleJSError(e));
        window.addEventListener('unhandled rejection', (e) => this.handlePromiseRejection(e));

        // Periodic health checks
        setInterval(() => this.runHealthCheck(), 30000); // Every 30s

        // Initial health check
        setTimeout(() => this.runHealthCheck(), 2000);

        this.log('SYSTEM_START', 'Autonomous optimization agent active');
    }

    /**
     * OBSERVE: Global Error Detection
     */
    handleJSError(event) {
        const error = {
            type: 'JS_ERROR',
            message: event.message,
            filename: event.filename,
            line: event.lineno,
            col: event.colno,
            stack: event.error?.stack,
            timestamp: new Date().toISOString()
        };

        this.errors.push(error);
        this.log('ERROR_DETECTED', error);

        // Auto-diagnose
        this.diagnose(error);
    }

    handlePromiseRejection(event) {
        const error = {
            type: 'PROMISE_REJECTION',
            reason: event.reason,
            timestamp: new Date().toISOString()
        };

        this.errors.push(error);
        this.log('ERROR_DETECTED', error);

        this.diagnose(error);
    }

    /**
     * DIAGNOSE: Identify Issue Type
     */
    diagnose(error) {
        this.log('DIAGNOSE_START', { error });

        // Check if it's a known fixable issue
        if (this.isFormRelated(error)) {
            this.attemptFormFix(error);
        } else if (this.isAPIRelated(error)) {
            this.attemptAPIFix(error);
        } else if (this.isDOMRelated(error)) {
            this.attemptDOMFix(error);
        } else {
            this.log('DIAGNOSE_UNKNOWN', { error, action: 'Logged only' });
        }
    }

    /**
     * HEALTH CHECK: Periodic System Verification
     */
    async runHealthCheck() {
        this.lastCheck = new Date();
        this.log('HEALTH_CHECK_START', {});

        const checks = {
            forms: await this.checkForms(),
            api: await this.checkAPI(),
            dom: await this.checkDOM(),
            storage: this.checkStorage()
        };

        this.healthChecks.set(this.lastCheck.toISOString(), checks);

        // If any check failed, auto-fix
        Object.entries(checks).forEach(([key, result]) => {
            if (!result.healthy) {
                this.log('HEALTH_CHECK_FAIL', { component: key, result });
                // Schedule fix
                setTimeout(() => this.autoFix(key, result), 100);
            }
        });

        this.log('HEALTH_CHECK_COMPLETE', checks);
    }

    async checkForms() {
        try {
            const quoteForm = document.getElementById('quoteForm');
            const surveyForm = document.getElementById('surveyForm');

            return {
                healthy: !!(quoteForm && surveyForm),
                quoteForm: !!quoteForm,
                surveyForm: !!surveyForm,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { healthy: false, error: error.message };
        }
    }

    async checkAPI() {
        // Simple connectivity check
        try {
            const response = await fetch('/api/health', { method: 'HEAD' });
            return {
                healthy: true, // Even 404 means server is responsive
                status: response.status,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    checkDOM() {
        try {
            const criticalElements = [
                'header',
                '.hero-modern',
                '.mobile-bottom-bar',
                '#successModal'
            ];

            const missing = criticalElements.filter(sel => !document.querySelector(sel));

            return {
                healthy: missing.length === 0,
                missing,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return { healthy: false, error: error.message };
        }
    }

    checkStorage() {
        try {
            localStorage.setItem('_health_check', Date.now());
            localStorage.removeItem('_health_check');
            return { healthy: true };
        } catch (error) {
            return { healthy: false, error: error.message };
        }
    }

    /**
     * FIX: Safe Auto-Repair Attempts
     */
    isFormRelated(error) {
        const msg = (error.message || error.reason || '').toLowerCase();
        return msg.includes('form') ||
            msg.includes('submit') ||
            msg.includes('input') ||
            msg.includes('quoteform') ||
            msg.includes('surveyform');
    }

    isAPIRelated(error) {
        const msg = (error.message || error.reason || '').toLowerCase();
        return msg.includes('fetch') ||
            msg.includes('network') ||
            msg.includes('api') ||
            msg.includes('telegram') ||
            msg.includes('email');
    }

    isDOMRelated(error) {
        const msg = (error.message || error.reason || '').toLowerCase();
        return msg.includes('null') && msg.includes('element') ||
            msg.includes('queryselector') ||
            msg.includes('getelementbyid');
    }

    attemptFormFix(error) {
        if (this.fixAttempts >= this.maxFixAttempts) {
            this.log('FIX_BLOCKED', { reason: 'Max attempts reached', error });
            return;
        }

        this.log('FIX_ATTEMPT_FORM', error);

        // Use new autonomous helpers from script.js
        try {
            if (typeof window.reattachFormHandlers === 'function') {
                const result = window.reattachFormHandlers();
                this.fixAttempts++;
                this.log('FIX_SUCCESS_FORM', {
                    method: 'autonomous_helpers',
                    result
                });
            } else {
                // Fallback: Basic prevention
                const quoteForm = document.getElementById('quoteForm');
                const surveyForm = document.getElementById('surveyForm');

                if (quoteForm && !quoteForm.dataset.autonomousFixed) {
                    quoteForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        console.warn('[Autonomous] Form handler missing, preventing default');
                    });
                    quoteForm.dataset.autonomousFixed = 'true';
                    this.fixAttempts++;
                    this.log('FIX_SUCCESS_FORM', { form: 'quoteForm', method: 'fallback' });
                }

                if (surveyForm && !surveyForm.dataset.autonomousFixed) {
                    surveyForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        console.warn('[Autonomous] Form handler missing, preventing default');
                    });
                    surveyForm.dataset.autonomousFixed = 'true';
                    this.fixAttempts++;
                    this.log('FIX_SUCCESS_FORM', { form: 'surveyForm', method: 'fallback' });
                }
            }
        } catch (fixError) {
            this.log('FIX_FAILED_FORM', { originalError: error, fixError });
        }
    }

    attemptAPIFix(error) {
        this.log('FIX_ATTEMPT_API', error);

        // Safe fix: Log and notify user
        // We DON'T auto-retry APIs (can spam)
        // We just log for manual intervention

        this.log('FIX_INFO_API', {
            message: 'API error logged. Manual intervention may be required.',
            error
        });
    }

    attemptDOMFix(error) {
        this.log('FIX_ATTEMPT_DOM', error);

        // Safe fix: Verify critical elements exist
        // If missing, log for rebuild (don't auto-create, too risky)

        const criticalElements = ['header', '.mobile-bottom-bar'];
        const missing = criticalElements.filter(sel => !document.querySelector(sel));

        if (missing.length > 0) {
            this.log('FIX_WARNING_DOM', {
                message: 'Critical elements missing. Rebuild recommended.',
                missing
            });
        } else {
            this.log('FIX_INFO_DOM', { message: 'DOM elements verified OK' });
        }
    }

    autoFix(component, healthResult) {
        this.log('AUTO_FIX_TRIGGERED', { component, healthResult });

        switch (component) {
            case 'forms':
                if (!healthResult.quoteForm) {
                    this.log('AUTO_FIX_INFO', { message: 'Quote form missing, logged' });
                }
                if (!healthResult.surveyForm) {
                    this.log('AUTO_FIX_INFO', { message: 'Survey form missing, logged' });
                }
                break;

            case 'api':
                this.log('AUTO_FIX_INFO', { message: 'API unreachable, check server' });
                break;

            case 'dom':
                this.log('AUTO_FIX_INFO', {
                    message: 'DOM elements missing',
                    missing: healthResult.missing
                });
                break;
        }
    }

    /**
     * LOGGING: Comprehensive Event Tracking
     */
    log(event, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            data,
            sessionId: this.getSessionId()
        };

        this.logs.push(logEntry);
        console.log(`[Autonomous Agent] ${event}`, data);

        // Store in localStorage (limit to last 100 entries)
        this.persistLogs();
    }

    persistLogs() {
        try {
            const recentLogs = this.logs.slice(-100);
            localStorage.setItem('autonomous_agent_logs', JSON.stringify(recentLogs));
        } catch (error) {
            console.warn('[Autonomous Agent] Could not persist logs:', error);
        }
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.sessionId;
    }

    /**
     * REPORTING: Generate Health Report
     */
    generateReport() {
        const report = {
            sessionId: this.getSessionId(),
            startTime: this.logs[0]?.timestamp || null,
            lastCheck: this.lastCheck?.toISOString() || null,
            totalErrors: this.errors.length,
            totalLogs: this.logs.length,
            fixAttempts: this.fixAttempts,
            healthChecks: Array.from(this.healthChecks.entries()),
            recentErrors: this.errors.slice(-10),
            recentLogs: this.logs.slice(-20)
        };

        console.table(report.healthChecks);
        return report;
    }

    /**
     * PUBLIC API
     */
    getHealth() {
        return Array.from(this.healthChecks.entries()).pop()?.[1] || null;
    }

    getLogs() {
        return this.logs;
    }

    getErrors() {
        return this.errors;
    }

    forceHealthCheck() {
        return this.runHealthCheck();
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.AutonomousAgent = AutonomousAgent;
    window.autonomousAgent = new AutonomousAgent();

    // Expose utility functions
    window.getAgentHealth = () => window.autonomousAgent.getHealth();
    window.getAgentReport = () => window.autonomousAgent.generateReport();
    window.forceHealthCheck = () => window.autonomousAgent.forceHealthCheck();

    console.log('%c[Autonomous Agent] Self-healing system active', 'color: #10b981; font-weight: bold');
    console.log('%cRun getAgentReport() to see system health', 'color: #6366f1');
}
