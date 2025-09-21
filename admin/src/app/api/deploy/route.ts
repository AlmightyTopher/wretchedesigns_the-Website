import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

// Use Node.js runtime for system operations
export const runtime = 'nodejs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const commitMessage = message || `Admin update: ${new Date().toISOString()}`;

    console.log("🚀 Starting deployment process...");

    // Step 1: Export current database data to JSON files
    await exportDatabaseToJSON();

    // Step 2: Run git commands to commit and push
    const gitRoot = process.env.NODE_ENV === 'production' ? '/app/project' : process.cwd();

    console.log("📁 Working in directory:", gitRoot);

    // Configure git in the container if needed
    if (process.env.NODE_ENV === 'production') {
      await execAsync('git config --global user.name "Wretched Designs Admin"', { cwd: gitRoot });
      await execAsync('git config --global user.email "admin@wretchedesigns.com"', { cwd: gitRoot });
    }

    // Add all changes
    await execAsync('git add .', { cwd: gitRoot });

    // Check if there are changes to commit
    const { stdout: statusOutput } = await execAsync('git status --porcelain', { cwd: gitRoot });

    if (!statusOutput.trim()) {
      return NextResponse.json({
        success: true,
        message: "No changes to deploy"
      });
    }

    // Commit changes
    await execAsync(`git commit -m "${commitMessage}"`, { cwd: gitRoot });

    // Push to main branch
    await execAsync('git push origin main', { cwd: gitRoot });

    console.log("✅ Successfully deployed to GitHub!");

    return NextResponse.json({
      success: true,
      message: "Successfully deployed to GitHub! Site will update automatically.",
      changesDetected: statusOutput.split('\n').length - 1
    });

  } catch (error) {
    console.error('Deploy error:', error);

    // Handle specific git errors
    if (error instanceof Error) {
      if (error.message.includes('nothing to commit')) {
        return NextResponse.json({
          success: true,
          message: "No changes to deploy"
        });
      }

      if (error.message.includes('remote: Permission denied')) {
        return NextResponse.json({
          success: false,
          error: "GitHub permission denied. Please check repository access."
        }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to deploy"
    }, { status: 500 });
  }
}

async function exportDatabaseToJSON() {
  try {
    const { getGalleryImages, getProducts } = await import("@/lib/supabase");

    // Export gallery data
    const galleryImages = await getGalleryImages();
    const galleryData = {
      images: galleryImages.map(img => ({
        id: img.id,
        url: img.url,
        title: img.title,
        description: img.description || "",
        order: img.order,
        createdAt: img.created_at,
        category: img.category || "Art"
      })),
      lastUpdated: new Date().toISOString()
    };

    // Export products data
    const products = await getProducts();
    const productsData = {
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        image: product.image || "",
        category: product.category || "",
        in_stock: product.in_stock,
        created_at: product.created_at,
        updated_at: product.updated_at
      })),
      lastUpdated: new Date().toISOString()
    };

    // Write to both admin and customer data directories
    const gitRoot = process.env.NODE_ENV === 'production' ? '/app/project' : process.cwd();

    // Write to admin data directory
    const adminDataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(adminDataDir, { recursive: true });

    await fs.writeFile(
      path.join(adminDataDir, 'gallery.json'),
      JSON.stringify(galleryData, null, 2)
    );

    await fs.writeFile(
      path.join(adminDataDir, 'products.json'),
      JSON.stringify(productsData, null, 2)
    );

    // Also write to customer data directory for deployment
    const customerDataDir = path.join(gitRoot, 'customer', 'data');
    await fs.mkdir(customerDataDir, { recursive: true });

    await fs.writeFile(
      path.join(customerDataDir, 'gallery.json'),
      JSON.stringify(galleryData, null, 2)
    );

    await fs.writeFile(
      path.join(customerDataDir, 'products.json'),
      JSON.stringify(productsData, null, 2)
    );

    console.log("📊 Database exported to JSON files");

  } catch (error) {
    console.error("Failed to export database:", error);
    throw error;
  }
}