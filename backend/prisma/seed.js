"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Companies to seed
  const companies = [
    { name: "TechNova", contactEmail: "info@technova.com", contactPhone: "123-111-1111", subscriptionPlan: "Basic" },
    { name: "GreenEdge Solutions", contactEmail: "info@greenedge.com", contactPhone: "123-222-2222", subscriptionPlan: "Basic" },
    { name: "ByteBridge", contactEmail: "info@bytebridge.com", contactPhone: "123-333-3333", subscriptionPlan: "Basic" },
    { name: "OmegaHealth", contactEmail: "info@omegahealth.com", contactPhone: "123-444-4444", subscriptionPlan: "Basic" },
    { name: "Cloudify", contactEmail: "info@cloudify.com", contactPhone: "123-555-5555", subscriptionPlan: "Basic" },
    { name: "SecureStack", contactEmail: "info@securestack.com", contactPhone: "123-666-6666", subscriptionPlan: "Basic" },
    { name: "DataSpring", contactEmail: "info@dataspring.com", contactPhone: "123-777-7777", subscriptionPlan: "Basic" },
    { name: "NextGen AI", contactEmail: "info@nextgenai.com", contactPhone: "123-888-8888", subscriptionPlan: "Basic" },
  ];

  // Seed companies and one admin user per company
  for (const [i, company] of companies.entries()) {
    const createdCompany = await prisma.company.create({
      data: {
        ...company,
        // subscriptionEndsAt and createdAt are optional/default
      },
    });

    // Create an admin user for each company
    const adminUser = await prisma.user.create({
      data: {
        companyId: createdCompany.id,
        firstName: "Admin",
        lastName: `User${i+1}`,
        email: `admin${i+1}@${company.contactEmail.split('@')[1]}`,
        passwordHash: "hashedpassword", // Replace with real hash in production
        role: "Admin",
        // isActive and createdAt are defaulted
      },
    });

    // Create a ServiceRequest for this company, created by the admin user
    await prisma.serviceRequest.create({
      data: {
        title: `Welcome Request for ${company.name}`,
        description: `This is a sample service request for ${company.name}.`,
        companyId: createdCompany.id,
        createdById: adminUser.id,
        status: "PENDING",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        // createdAt and updatedAt are defaulted
      },
    });

    // Add more sample ServiceRequests for this company
    const moreRequests = [
      {
        title: `IT Support - Email Issues`,
        description: `Employees of ${company.name} are experiencing issues with email delivery.`,
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: `Cloud Migration Consultation`,
        description: `${company.name} is planning to migrate to the cloud and requests consultation.`,
        status: "PENDING",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: `Security Audit Request`,
        description: `${company.name} would like a full audit of their systems for vulnerabilities.`,
        status: "PENDING",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: `Bug Report - CRM not loading`,
        description: `The internal CRM system used by ${company.name} fails to load for some users.`,
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: `Feature Request - Dark Mode`,
        description: `${company.name} requested a dark mode feature in the dashboard.`,
        status: "COMPLETED",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // already done
      },
    ];

    for (const request of moreRequests) {
      await prisma.serviceRequest.create({
        data: {
          ...request,
          companyId: createdCompany.id,
          createdById: adminUser.id,
        },
      });
    }
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
