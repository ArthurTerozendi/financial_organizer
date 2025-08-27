#!/usr/bin/env node

/**
 * PWA Testing Script
 * 
 * This script helps verify that the PWA setup is working correctly.
 * Run this after building the app to check PWA features.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 PWA Configuration Check\n');

// Check if manifest.json exists and is valid
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ Manifest.json found and valid');
    console.log(`   - Name: ${manifest.name}`);
    console.log(`   - Short name: ${manifest.short_name}`);
    console.log(`   - Display: ${manifest.display}`);
    console.log(`   - Icons: ${manifest.icons?.length || 0} icons defined`);
  } catch (error) {
    console.log('❌ Manifest.json is invalid JSON');
  }
} else {
  console.log('❌ Manifest.json not found');
}

// Check if service worker exists
const swPath = path.join(__dirname, '../public/serviceWorker.js');
if (fs.existsSync(swPath)) {
  console.log('✅ Service worker found');
} else {
  console.log('❌ Service worker not found');
}

// Check if index.html has PWA meta tags
const htmlPath = path.join(__dirname, '../index.html');
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const hasManifest = html.includes('manifest.json');
  const hasThemeColor = html.includes('theme-color');
  const hasAppleTouchIcon = html.includes('apple-touch-icon');
  
  console.log('✅ HTML PWA meta tags:');
  console.log(`   - Manifest link: ${hasManifest ? '✅' : '❌'}`);
  console.log(`   - Theme color: ${hasThemeColor ? '✅' : '❌'}`);
  console.log(`   - Apple touch icon: ${hasAppleTouchIcon ? '✅' : '❌'}`);
} else {
  console.log('❌ index.html not found');
}

// Check if PWA components exist
const pwaComponents = [
  '../src/components/pwaInstall/index.tsx',
  '../src/components/pwaUpdate/index.tsx',
  '../src/components/offlinePage/index.tsx',
  '../src/hooks/useNetworkStatus.ts'
];

console.log('\n📱 PWA Components:');
pwaComponents.forEach(component => {
  const componentPath = path.join(__dirname, component);
  if (fs.existsSync(componentPath)) {
    console.log(`   ✅ ${path.basename(component)}`);
  } else {
    console.log(`   ❌ ${path.basename(component)}`);
  }
});

// Check vite.config.ts for PWA plugin
const viteConfigPath = path.join(__dirname, '../vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const config = fs.readFileSync(viteConfigPath, 'utf8');
  const hasPwaPlugin = config.includes('VitePWA');
  const hasWorkbox = config.includes('workbox');
  
  console.log('\n⚙️ Vite Configuration:');
  console.log(`   - PWA Plugin: ${hasPwaPlugin ? '✅' : '❌'}`);
  console.log(`   - Workbox config: ${hasWorkbox ? '✅' : '❌'}`);
} else {
  console.log('\n❌ vite.config.ts not found');
}

console.log('\n🎯 Next Steps:');
console.log('1. Run "npm run build" to build the app');
console.log('2. Run "npm run preview" to serve the built files');
console.log('3. Open Chrome DevTools → Application tab');
console.log('4. Check Manifest and Service Workers sections');
console.log('5. Test install prompt and offline functionality');
console.log('6. Run Lighthouse audit for PWA score');

console.log('\n📚 For more information, see PWA_README.md');
