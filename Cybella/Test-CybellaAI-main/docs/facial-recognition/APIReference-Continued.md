

# API Reference (Continued)

This document contains additional API references for the facial recognition system.

## Network Status Monitoring

### `useConnectionStatus`

**File:** `src/hooks/facial-recognition/useConnectionStatus.ts`

```typescript
interface ConnectionStatusOptions {
  externalConnectionIssue?: boolean;
  checkConnectionQuality?: boolean;
  pollingInterval?: number;
}

function useConnectionStatus(options?: ConnectionStatusOptions): {
  connectionIssue: boolean;
  isOnline: boolean;
  connectionQuality: 'good' | 'poor';
}
```

Monitors network status and detects connection quality issues that might affect facial recognition performance.

#### Options:

- `externalConnectionIssue`: External flag to force connection issue state
- `checkConnectionQuality`: Whether to actively check connection quality (defaults to true)
- `pollingInterval`: How often to check connection quality in milliseconds (defaults to 10000)

#### Returns:

- `connectionIssue`: Boolean indicating if there's any connection problem
- `isOnline`: Boolean indicating if the device is online
- `connectionQuality`: Quality rating as 'good' or 'poor'

## Network Status Component

### `ConnectivityWarning`

**File:** `src/components/ConnectivityWarning.tsx`

```typescript
interface ConnectivityWarningProps {
  onNetworkIssue?: (hasIssue: boolean) => void;
}

function ConnectivityWarning(props: ConnectivityWarningProps): JSX.Element | null
```

Component that displays connectivity warnings and provides callback when network status changes.

#### Props:

- `onNetworkIssue`: Callback function triggered when network status changes

## General Hooks

### `useNetworkStatus`

**File:** `src/hooks/useNetworkStatus.ts`

```typescript
function useNetworkStatus(): {
  isOnline: boolean;
  connectionQuality: 'good' | 'poor';
  hasBuffering: boolean;
  lastConnectionChange: Date;
}
```

A general-purpose hook for monitoring network status across the application.

#### Returns:

- `isOnline`: Boolean indicating if the device is connected to the internet
- `connectionQuality`: Quality rating as 'good' or 'poor'
- `hasBuffering`: Boolean indicating if buffering has been detected
- `lastConnectionChange`: Timestamp of the last connection state change

## Emotion Analysis Configuration

### `Emotion Detection Settings`

The facial emotion detection system prioritizes accuracy over speed with the following configuration:

- **Frame Processing Interval**: 800ms between frames (increased for more thorough analysis)
- **Detection Timeout**: 5000ms (extended to allow more comprehensive model processing)
- **History Length**: 15 samples (increased for better emotion stability)
- **History Duration**: 8000ms of emotion history (extended for smoother transitions)
- **Detection Resolution**: 512px input size (higher resolution for better feature extraction)

These settings significantly enhance emotion detection accuracy at the cost of slightly reduced responsiveness.
