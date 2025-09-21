#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building customer site...');

// Create output directory
const outDir = path.join(__dirname, '..', 'out-customer');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy customer files
const customerDir = path.join(__dirname, '..', 'customer');
console.log('📁 Copying customer files...');
copyDirectory(customerDir, outDir);

// Copy admin data files to customer site
const adminDataDir = path.join(__dirname, '..', 'admin', 'public', 'data');
const customerDataDir = path.join(outDir, 'data');

if (fs.existsSync(adminDataDir)) {
  console.log('📊 Copying admin data to customer site...');
  fs.mkdirSync(customerDataDir, { recursive: true });
  copyDirectory(adminDataDir, customerDataDir);
}

// Copy uploaded images
const adminImagesDir = path.join(__dirname, '..', 'admin', 'public', 'Images');
const customerImagesDir = path.join(outDir, 'Images');

if (fs.existsSync(adminImagesDir)) {
  console.log('🖼️  Copying images to customer site...');
  copyDirectory(adminImagesDir, customerImagesDir);
}

// Copy uploaded files
const adminUploadsDir = path.join(__dirname, '..', 'admin', 'public', 'uploads');
const customerUploadsDir = path.join(outDir, 'uploads');

if (fs.existsSync(adminUploadsDir)) {
  console.log('📎 Copying uploads to customer site...');
  copyDirectory(adminUploadsDir, customerUploadsDir);
}

console.log('✅ Customer site build complete!');

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}