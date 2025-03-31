import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth'
import { Capacitor } from '@capacitor/core'
import { BiometryErrorType } from '@aparajita/capacitor-biometric-auth'

/**
 * Authentication store for managing biometric authentication state
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref<boolean>(false)
  const authError = ref<string | null>(null)

  // Actions
  /**
   * Authenticate using biometrics
   */
  async function authenticateWithBiometrics(): Promise<boolean> {
    try {
      // Reset error state
      authError.value = null

      // Check if running in browser mode
      if (!Capacitor.isNativePlatform()) {
        // Simulate successful authentication in browser mode
        console.log('Simulating biometric authentication in browser mode')

        // For web testing, we can use the web-specific methods to simulate biometrics
        await BiometricAuth.setBiometryType('faceId')
        await BiometricAuth.setBiometryIsEnrolled(true)
        await BiometricAuth.setDeviceIsSecure(true)

        try {
          await BiometricAuth.authenticate({
            reason: 'Please authenticate to access the app',
            cancelTitle: 'Cancel'
          })
          isAuthenticated.value = true
          return true
        } catch (error) {
          console.error('Simulated authentication error:', error)
          authError.value = 'Simulated authentication failed'
          return false
        }
      }

      // Check if biometric auth is available
      const biometryResult = await BiometricAuth.checkBiometry()

      if (!biometryResult.isAvailable) {
        let errorMessage = 'Biometric authentication is not available'

        // Provide more specific error messages based on the error code
        if (biometryResult.code) {
          switch (biometryResult.code) {
            case BiometryErrorType.biometryNotEnrolled:
              errorMessage = 'Biometric authentication is not set up on this device'
              break
            case BiometryErrorType.biometryNotAvailable:
              errorMessage = 'This device does not support biometric authentication'
              break
            case BiometryErrorType.passcodeNotSet:
              errorMessage = 'Device passcode is not set, which is required for biometric authentication'
              break
            default:
              errorMessage = biometryResult.reason || errorMessage
          }
        }

        authError.value = errorMessage
        return false
      }

      // Perform authentication
      try {
        await BiometricAuth.authenticate({
          reason: 'Please authenticate to access the app',
          cancelTitle: 'Cancel',
          // Allow fallback to device credentials if biometrics fail
          allowDeviceCredential: true
        })

        isAuthenticated.value = true
        return true
      } catch (error) {
        if (error && typeof error === 'object' && 'code' in error) {
          const biometryError = error as { code: BiometryErrorType, message: string }

          // Handle specific error types
          switch (biometryError.code) {
            case BiometryErrorType.userCancel:
              authError.value = 'Authentication was canceled by the user'
              break
            case BiometryErrorType.authenticationFailed:
              authError.value = 'Authentication failed. Please try again.'
              break
            case BiometryErrorType.biometryLockout:
              authError.value = 'Too many failed attempts. Biometric authentication is temporarily locked.'
              break
            default:
              authError.value = biometryError.message || 'Authentication failed'
          }
        } else {
          authError.value = error instanceof Error ? error.message : 'Authentication failed'
        }

        isAuthenticated.value = false
        return false
      }
    } catch (error) {
      console.error('Unexpected error during authentication:', error)
      authError.value = error instanceof Error ? error.message : 'Unexpected authentication error'
      isAuthenticated.value = false
      return false
    }
  }

  /**
   * Sign out the user
   */
  function signOut(): void {
    isAuthenticated.value = false
    authError.value = null
  }

  return {
    // State
    isAuthenticated,
    authError,

    // Actions
    authenticateWithBiometrics,
    signOut
  }
})

