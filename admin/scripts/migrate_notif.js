const { PrismaClient } = require('@prisma/client');

// Use environment variable or default configuration for migration
const rootUrl = process.env.DATABASE_URL || "mysql://root:password@127.0.0.1:3306/gticc_db";
const p = new PrismaClient({
  datasources: {
    db: { url: rootUrl }
  }
});

async function main() {
  const sql = `
CREATE TABLE IF NOT EXISTS application_notifications (
  id VARCHAR(36) NOT NULL,
  application_type VARCHAR(50) NOT NULL,
  application_id VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NULL,
  decision VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  message_id VARCHAR(255) NULL,
  error_message TEXT NULL,
  sent_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX application_notifications_lookup_idx (application_id, decision),
  INDEX application_notifications_status_idx (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  console.log('Creating table with root privileges...');
  await p.$executeRawUnsafe(sql);
  console.log('Table application_notifications created/verified successfully!');

  console.log('Granting permissions to gticc_app...');
  await p.$executeRawUnsafe("GRANT ALL PRIVILEGES ON gticc_db.* TO 'gticc_app'@'%';");
  await p.$executeRawUnsafe("GRANT ALL PRIVILEGES ON gticc_db.* TO 'gticc_app'@'localhost';");
  await p.$executeRawUnsafe("FLUSH PRIVILEGES;");
  console.log('Permissions updated!');

  await p.$disconnect();

  // Now test with standard gticc_app prisma client
  const appClient = new PrismaClient();
  const count = await appClient.applicationNotification.count();
  console.log('Verified from standard gticc_app client: count =', count);
  await appClient.$disconnect();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
