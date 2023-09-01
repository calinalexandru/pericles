export default function isGrammarlyAppHost(window: Window): boolean {
  return window.location.hostname === 'app.grammarly.com';
}
