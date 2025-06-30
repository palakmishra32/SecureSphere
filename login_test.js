// test.js - Test cases for anomaly detection
describe('Anomaly Detection Tests', () => {
    let detector;

    beforeEach(() => {
        detector = new AnomalyDetector();
        // Mock chrome.storage.local
        global.chrome = {
            storage: {
                local: {
                    get: (keys, callback) => callback({}),
                    set: () => {}
                }
            }
        };
    });

    test('should detect unusual login time', () => {
        // Setup normal activity pattern (9 AM - 5 PM)
        detector.userActivities['test@example.com'] = Array.from({ length: 10 }, (_, i) => ({
            hour: 9 + (i % 8),
            duration: 30,
            timestamp: new Date().toISOString()
        }));

        // Test unusual time (3 AM)
        const unusualActivity = {
            email: 'test@example.com',
            hour: 3,
            duration: 30,
            timestamp: new Date().toISOString()
        };

        expect(detector.detectAnomaly(unusualActivity)).toBe(true);
    });

    test('should detect unusual duration', () => {
        // Setup normal activity pattern (30-minute sessions)
        detector.userActivities['test@example.com'] = Array.from({ length: 10 }, () => ({
            hour: 14,
            duration: 30,
            timestamp: new Date().toISOString()
        }));

        // Test unusual duration (3 hours)
        const unusualActivity = {
            email: 'test@example.com',
            hour: 14,
            duration: 180,
            timestamp: new Date().toISOString()
        };

        expect(detector.detectAnomaly(unusualActivity)).toBe(true);
    });

    test('should block after three failed attempts', () => {
        const response = detector.handleLoginAttempt({
            email: 'test@example.com',
            attemptCount: 3
        });

        expect(response.status).toBe('blocked');
    });
});