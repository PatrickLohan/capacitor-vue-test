<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import HelloWorld from './components/HelloWorld.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const isNative = ref(Capacitor.isNativePlatform())
const authMessage = ref('')

async function authenticate() {
  authMessage.value = 'Authenticating...'
  const success = await authStore.authenticateWithBiometrics()

  if (success) {
    authMessage.value = 'Authentication successful!'
  } else {
    authMessage.value = authStore.authError || 'Authentication failed'
  }
}

function signOut() {
  authStore.signOut()
  authMessage.value = 'Signed out'
}

onMounted(() => {
  if (!isNative.value) {
    authMessage.value = 'Running in browser mode - authentication will be simulated'
  }
})
</script>

<template>
  <div class="app-container">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <div class="auth-container">
        <h2>Biometric Authentication Demo</h2>

        <div class="auth-controls">
          <p class="auth-status" :class="{ 'authenticated': authStore.isAuthenticated }">
            Status: {{ authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated' }}
          </p>

          <button v-if="!authStore.isAuthenticated" @click="authenticate" class="auth-button">
            Authenticate with Biometrics
          </button>

          <button v-else @click="signOut" class="auth-button signout">
            Sign Out
          </button>

          <p class="auth-message">{{ authMessage }}</p>
        </div>

        <div v-if="!isNative" class="platform-warning">
          <p>Note: Biometric authentication is only available on native platforms (iOS/Android).</p>
          <p>You're currently running in a web browser, so authentication will be simulated.</p>
        </div>
      </div>

      <!-- <RouterView /> -->
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--color-background-soft);
  text-align: center;
}

.auth-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.auth-status {
  font-weight: bold;
  color: #e74c3c;
}

.auth-status.authenticated {
  color: #2ecc71;
}

.auth-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #2980b9;
}

.auth-button.signout {
  background-color: #e74c3c;
}

.auth-button.signout:hover {
  background-color: #c0392b;
}

.auth-message {
  margin-top: 1rem;
  font-style: italic;
}

.platform-warning {
  padding: 1rem;
  background-color: #fcf8e3;
  border-left: 4px solid #f39c12;
  color: #8a6d3b;
  text-align: left;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
