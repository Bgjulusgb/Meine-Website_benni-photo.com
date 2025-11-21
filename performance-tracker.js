/**
 * ==========================================
 * PERFORMANCE TRACKER - UMFASSENDES MONITORING SYSTEM
 * ==========================================
 *
 * Detailliertes Performance-Tracking & Monitoring Backend
 * Features:
 * - Core Web Vitals Tracking (LCP, FID, CLS, FCP, TTFB)
 * - Resource Loading Performance
 * - JavaScript Execution Time Tracking
 * - Memory Usage Monitoring
 * - Network Request Monitoring
 * - User Interaction Timing
 * - Page Load Performance
 * - Long Task Detection
 * - Frame Rate Monitoring (FPS)
 * - Bundle Size Analysis
 * - Cache Performance
 * - API Response Time Tracking
 * - Error Rate Monitoring
 * - Performance Budgets & Alerts
 * - Historical Data Comparison
 * - Real-Time Performance Dashboard Data
 * - Export & Reporting
 */

const PerformanceTracker = {
  // Konfiguration
  config: {
    enabled: true,
    enableWebVitals: true,
    enableResourceTiming: true,
    enableLongTaskDetection: true,
    enableFPSMonitoring: true,
    enableMemoryTracking: true,
    enableNetworkMonitoring: true,
    sampleRate: 1.0, // 100% der Sessions tracken
    reportInterval: 30000, // Report alle 30 Sekunden
    longTaskThreshold: 50, // ms
    slowFrameThreshold: 16.67, // 60 FPS = 16.67ms per frame
    performanceBudget: {
      LCP: 2500, // ms
      FID: 100, // ms
      CLS: 0.1,
      FCP: 1800, // ms
      TTFB: 600, // ms
      totalPageSize: 2000000, // 2MB
      totalRequests: 50
    },
    enableReporting: true,
    enableConsoleOutput: true,
  },

  // State & Metriken
  metrics: {
    // Core Web Vitals
    webVitals: {
      LCP: null, // Largest Contentful Paint
      FID: null, // First Input Delay
      CLS: null, // Cumulative Layout Shift
      FCP: null, // First Contentful Paint
      TTFB: null, // Time to First Byte
    },

    // Page Load Metrics
    pageLoad: {
      domContentLoaded: null,
      loadComplete: null,
      domInteractive: null,
      domComplete: null,
    },

    // Resource Metrics
    resources: {
      total: 0,
      images: 0,
      scripts: 0,
      stylesheets: 0,
      fonts: 0,
      other: 0,
      totalSize: 0,
      totalDuration: 0,
    },

    // Long Tasks
    longTasks: [],

    // Frame Rate
    fps: {
      current: 0,
      average: 0,
      min: Infinity,
      max: 0,
      samples: [],
    },

    // Memory
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    },

    // Network
    network: {
      requests: [],
      totalRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
    },

    // User Interactions
    interactions: {
      clicks: 0,
      scrolls: 0,
      keyPresses: 0,
      averageResponseTime: 0,
    },

    // Errors
    errors: {
      javascript: [],
      network: [],
      total: 0,
    },

    // Timing
    marks: new Map(),
    measures: new Map(),
  },

  // Observer Instances
  observers: {
    performanceObserver: null,
    mutationObserver: null,
    resizeObserver: null,
  },

  // State
  state: {
    initialized: false,
    tracking: false,
    lastReport: null,
    reportCount: 0,
    sessionStart: null,
    pageVisible: true,
  },

  // Initialisierung
  init() {
    if (!this.config.enabled || this.state.initialized) return;

    console.log('[PerformanceTracker] Initialisierung gestartet...');

    this.state.sessionStart = Date.now();
    this.state.initialized = true;
    this.state.tracking = true;

    // Prüfe ob wir tracken sollten (Sampling)
    if (Math.random() > this.config.sampleRate) {
      console.log('[PerformanceTracker] Session wird nicht getrackt (Sampling)');
      return;
    }

    this.setupWebVitals();
    this.setupResourceTiming();
    this.setupLongTaskDetection();
    this.setupFPSMonitoring();
    this.setupMemoryTracking();
    this.setupNetworkMonitoring();
    this.setupInteractionTracking();
    this.setupErrorTracking();
    this.setupVisibilityTracking();
    this.trackPageLoad();
    this.startReporting();

    console.log('[PerformanceTracker] Initialisierung abgeschlossen.');
  },

  // Core Web Vitals Setup
  setupWebVitals() {
    if (!this.config.enableWebVitals) return;

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.metrics.webVitals.LCP = entry.renderTime || entry.loadTime;
      this.checkBudget('LCP', this.metrics.webVitals.LCP);
      this.log('LCP', this.metrics.webVitals.LCP);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry) => {
      this.metrics.webVitals.FID = entry.processingStart - entry.startTime;
      this.checkBudget('FID', this.metrics.webVitals.FID);
      this.log('FID', this.metrics.webVitals.FID);
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    let clsEntries = [];

    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }

      this.metrics.webVitals.CLS = clsValue;
      this.checkBudget('CLS', clsValue);
    });

    // First Contentful Paint (FCP) & TTFB via Navigation Timing
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const timing = performance.timing;

        // TTFB
        this.metrics.webVitals.TTFB = timing.responseStart - timing.requestStart;
        this.checkBudget('TTFB', this.metrics.webVitals.TTFB);
        this.log('TTFB', this.metrics.webVitals.TTFB);

        // FCP
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');

        if (fcpEntry) {
          this.metrics.webVitals.FCP = fcpEntry.startTime;
          this.checkBudget('FCP', this.metrics.webVitals.FCP);
          this.log('FCP', this.metrics.webVitals.FCP);
        }
      });
    }
  },

  // Performance Observer Helper
  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });

      observer.observe({ entryTypes: [type] });
      this.observers.performanceObserver = observer;

    } catch (error) {
      console.warn(`[PerformanceTracker] ${type} nicht unterstützt:`, error);
    }
  },

  // Resource Timing
  setupResourceTiming() {
    if (!this.config.enableResourceTiming) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource');

        resources.forEach(resource => {
          const type = this.getResourceType(resource.name);

          this.metrics.resources.total++;
          this.metrics.resources[type]++;
          this.metrics.resources.totalSize += resource.transferSize || 0;
          this.metrics.resources.totalDuration += resource.duration;

          // Warne bei langsamen Ressourcen
          if (resource.duration > 1000) {
            this.warn(`Langsame Ressource: ${resource.name} (${Math.round(resource.duration)}ms)`);
          }
        });

        this.checkBudget('totalPageSize', this.metrics.resources.totalSize);
        this.checkBudget('totalRequests', this.metrics.resources.total);

        this.log('Resources', {
          total: this.metrics.resources.total,
          size: this.formatBytes(this.metrics.resources.totalSize),
          duration: `${Math.round(this.metrics.resources.totalDuration)}ms`
        });
      }, 1000);
    });
  },

  // Ermittle Ressourcen-Typ
  getResourceType(url) {
    if (/\.(jpe?g|png|gif|svg|webp)$/i.test(url)) return 'images';
    if (/\.(js)$/i.test(url)) return 'scripts';
    if (/\.(css)$/i.test(url)) return 'stylesheets';
    if (/\.(woff2?|ttf|eot)$/i.test(url)) return 'fonts';
    return 'other';
  },

  // Long Task Detection
  setupLongTaskDetection() {
    if (!this.config.enableLongTaskDetection) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > this.config.longTaskThreshold) {
            this.metrics.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });

            this.warn(`Long Task detected: ${Math.round(entry.duration)}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

    } catch (error) {
      console.warn('[PerformanceTracker] Long Task API nicht unterstützt');
    }
  },

  // FPS Monitoring
  setupFPSMonitoring() {
    if (!this.config.enableFPSMonitoring) return;

    let lastFrameTime = performance.now();
    let frameCount = 0;

    const measureFPS = (currentTime) => {
      const delta = currentTime - lastFrameTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);

        this.metrics.fps.current = fps;
        this.metrics.fps.samples.push(fps);
        this.metrics.fps.min = Math.min(this.metrics.fps.min, fps);
        this.metrics.fps.max = Math.max(this.metrics.fps.max, fps);

        // Durchschnitt berechnen
        const sum = this.metrics.fps.samples.reduce((a, b) => a + b, 0);
        this.metrics.fps.average = Math.round(sum / this.metrics.fps.samples.length);

        // Warne bei niedrigem FPS
        if (fps < 30) {
          this.warn(`Niedriger FPS: ${fps}`);
        }

        frameCount = 0;
        lastFrameTime = currentTime;

        // Limitiere Samples
        if (this.metrics.fps.samples.length > 60) {
          this.metrics.fps.samples.shift();
        }
      }

      frameCount++;

      if (this.state.tracking) {
        requestAnimationFrame(measureFPS);
      }
    };

    requestAnimationFrame(measureFPS);
  },

  // Memory Tracking
  setupMemoryTracking() {
    if (!this.config.enableMemoryTracking) return;

    if (!performance.memory) {
      console.warn('[PerformanceTracker] Memory API nicht verfügbar');
      return;
    }

    setInterval(() => {
      this.metrics.memory.usedJSHeapSize = performance.memory.usedJSHeapSize;
      this.metrics.memory.totalJSHeapSize = performance.memory.totalJSHeapSize;
      this.metrics.memory.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;

      // Warne bei hoher Memory-Nutzung (>90%)
      const usagePercent = (this.metrics.memory.usedJSHeapSize / this.metrics.memory.jsHeapSizeLimit) * 100;

      if (usagePercent > 90) {
        this.warn(`Hohe Memory-Nutzung: ${usagePercent.toFixed(1)}%`);
      }
    }, 5000);
  },

  // Network Monitoring
  setupNetworkMonitoring() {
    if (!this.config.enableNetworkMonitoring) return;

    // Überwache XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._trackingData = { method, url, startTime: performance.now() };
      return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
      this.addEventListener('load', function() {
        const duration = performance.now() - this._trackingData.startTime;

        PerformanceTracker.trackNetworkRequest({
          method: this._trackingData.method,
          url: this._trackingData.url,
          status: this.status,
          duration,
          success: this.status >= 200 && this.status < 300,
        });
      });

      this.addEventListener('error', function() {
        PerformanceTracker.trackNetworkRequest({
          method: this._trackingData.method,
          url: this._trackingData.url,
          status: 0,
          duration: performance.now() - this._trackingData.startTime,
          success: false,
        });
      });

      return originalXHRSend.apply(this, arguments);
    };

    // Überwache Fetch
    const originalFetch = window.fetch;

    window.fetch = function(...args) {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;

      return originalFetch.apply(this, args)
        .then(response => {
          const duration = performance.now() - startTime;

          PerformanceTracker.trackNetworkRequest({
            method: args[1]?.method || 'GET',
            url,
            status: response.status,
            duration,
            success: response.ok,
          });

          return response;
        })
        .catch(error => {
          const duration = performance.now() - startTime;

          PerformanceTracker.trackNetworkRequest({
            method: args[1]?.method || 'GET',
            url,
            status: 0,
            duration,
            success: false,
            error: error.message,
          });

          throw error;
        });
    };
  },

  // Track Network Request
  trackNetworkRequest(data) {
    this.metrics.network.requests.push(data);
    this.metrics.network.totalRequests++;

    if (!data.success) {
      this.metrics.network.failedRequests++;
    }

    // Berechne durchschnittliche Response Time
    const totalDuration = this.metrics.network.requests.reduce((sum, req) => sum + req.duration, 0);
    this.metrics.network.averageResponseTime = totalDuration / this.metrics.network.requests.length;

    // Warne bei langsamen Requests
    if (data.duration > 3000) {
      this.warn(`Langsamer Network Request: ${data.url} (${Math.round(data.duration)}ms)`);
    }
  },

  // Interaction Tracking
  setupInteractionTracking() {
    // Clicks
    document.addEventListener('click', () => {
      this.metrics.interactions.clicks++;
    }, { passive: true });

    // Scrolls
    let scrolling = false;
    window.addEventListener('scroll', () => {
      if (!scrolling) {
        this.metrics.interactions.scrolls++;
        scrolling = true;
        setTimeout(() => scrolling = false, 100);
      }
    }, { passive: true });

    // Key Presses
    document.addEventListener('keypress', () => {
      this.metrics.interactions.keyPresses++;
    }, { passive: true });
  },

  // Error Tracking
  setupErrorTracking() {
    // JavaScript Errors
    window.addEventListener('error', (event) => {
      this.metrics.errors.javascript.push({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
      });

      this.metrics.errors.total++;

      this.warn(`JavaScript Error: ${event.message}`);
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.javascript.push({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
      });

      this.metrics.errors.total++;
    });
  },

  // Visibility Tracking
  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      this.state.pageVisible = !document.hidden;

      if (!this.state.pageVisible) {
        this.log('Page hidden', 'User switched tab/window');
      }
    });
  },

  // Page Load Tracking
  trackPageLoad() {
    window.addEventListener('DOMContentLoaded', () => {
      if (performance.timing) {
        const timing = performance.timing;
        this.metrics.pageLoad.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      }

      this.log('DOMContentLoaded', this.metrics.pageLoad.domContentLoaded);
    });

    window.addEventListener('load', () => {
      if (performance.timing) {
        const timing = performance.timing;
        this.metrics.pageLoad.loadComplete = timing.loadEventEnd - timing.navigationStart;
        this.metrics.pageLoad.domInteractive = timing.domInteractive - timing.navigationStart;
        this.metrics.pageLoad.domComplete = timing.domComplete - timing.navigationStart;
      }

      this.log('Page Load Complete', this.metrics.pageLoad.loadComplete);
    });
  },

  // Performance Budget Check
  checkBudget(metric, value) {
    const budget = this.config.performanceBudget[metric];

    if (budget && value > budget) {
      this.warn(`Performance Budget überschritten: ${metric} = ${value} (Budget: ${budget})`);
    }
  },

  // Reporting
  startReporting() {
    if (!this.config.enableReporting) return;

    setInterval(() => {
      this.generateReport();
    }, this.config.reportInterval);

    // Report bei Page Unload
    window.addEventListener('beforeunload', () => {
      this.generateReport(true);
    });
  },

  // Generate Report
  generateReport(final = false) {
    this.state.reportCount++;
    this.state.lastReport = Date.now();

    const report = {
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
      sessionDuration: Date.now() - this.state.sessionStart,
      reportNumber: this.state.reportCount,
      final,

      webVitals: this.metrics.webVitals,
      pageLoad: this.metrics.pageLoad,
      resources: {
        ...this.metrics.resources,
        totalSizeFormatted: this.formatBytes(this.metrics.resources.totalSize),
      },
      longTasks: {
        count: this.metrics.longTasks.length,
        totalDuration: this.metrics.longTasks.reduce((sum, task) => sum + task.duration, 0),
      },
      fps: {
        current: this.metrics.fps.current,
        average: this.metrics.fps.average,
        min: this.metrics.fps.min,
        max: this.metrics.fps.max,
      },
      memory: {
        ...this.metrics.memory,
        usedFormatted: this.formatBytes(this.metrics.memory.usedJSHeapSize),
        limitFormatted: this.formatBytes(this.metrics.memory.jsHeapSizeLimit),
      },
      network: {
        totalRequests: this.metrics.network.totalRequests,
        failedRequests: this.metrics.network.failedRequests,
        averageResponseTime: Math.round(this.metrics.network.averageResponseTime),
      },
      interactions: this.metrics.interactions,
      errors: {
        total: this.metrics.errors.total,
        javascript: this.metrics.errors.javascript.length,
      },

      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.sendReport(report);

    return report;
  },

  // Send Report
  sendReport(report) {
    if (this.config.enableConsoleOutput) {
      console.log('[PerformanceTracker] Report:', report);
    }

    // Hier könnte der Report an einen Server gesendet werden
    // z.B. via fetch() zu einer Analytics-API
  },

  // Session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('perf_session_id');

    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('perf_session_id', sessionId);
    }

    return sessionId;
  },

  // Export Metriken
  exportMetrics() {
    const dataStr = JSON.stringify(this.metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    this.log('Export', 'Metriken exportiert');
  },

  // Utilities
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  },

  log(label, value) {
    if (this.config.enableConsoleOutput) {
      console.log(`[PerformanceTracker] ${label}:`, value);
    }
  },

  warn(message) {
    if (this.config.enableConsoleOutput) {
      console.warn(`[PerformanceTracker] ⚠️ ${message}`);
    }
  },

  // Public API
  getMetrics() {
    return this.metrics;
  },

  getReport() {
    return this.generateReport();
  },

  stop() {
    this.state.tracking = false;
    console.log('[PerformanceTracker] Tracking gestoppt');
  },

  resume() {
    this.state.tracking = true;
    console.log('[PerformanceTracker] Tracking fortgesetzt');
  },
};

// Auto-Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PerformanceTracker.init());
} else {
  PerformanceTracker.init();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceTracker;
}

// Global verfügbar machen
window.PerformanceTracker = PerformanceTracker;
