import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function initializeSuperAdmin() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
  
  if (!superAdminEmail || !superAdminPassword) {
    throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in environment variables");
  }
  
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" }
    });
    
    if (existingSuperAdmin) {
      console.log("Super admin already exists");
      return existingSuperAdmin;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
    
    // Create super admin
    const superAdmin = await prisma.user.create({
      data: {
        id: `super_admin_${Date.now()}`,
        name: "Super Admin",
        email: superAdminEmail,
        emailVerified: true,
        role: "SUPER_ADMIN",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log("Super admin created successfully");
    return superAdmin;
    
  } catch (error) {
    console.error("Error creating super admin:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  initializeSuperAdmin()
    .then(() => {
      console.log("Super admin initialization completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Super admin initialization failed:", error);
      process.exit(1);
    });
}
